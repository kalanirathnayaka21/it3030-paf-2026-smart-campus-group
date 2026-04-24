package com.pafproject.backend.service;

import com.pafproject.backend.dto.BookingRequest;
import com.pafproject.backend.dto.BookingResponse;
import com.pafproject.backend.model.*;
import com.pafproject.backend.repository.BookingRepository;
import com.pafproject.backend.repository.ResourceRepository;
import com.pafproject.backend.service.ResourceService.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

/**
 * Business logic for the Resource Booking workflow.
 * Key rules:
 *  - Only ACTIVE resources can be booked.
 *  - Overlapping PENDING/APPROVED bookings cause a 409 Conflict.
 *  - Only the booking owner can cancel their own PENDING booking.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final AppUserService userService;

    /** Lazily injected to avoid circular dependency (NotificationService → AppUserService ← BookingService) */
    @Setter(onMethod_ = {@Autowired, @Lazy})
    private NotificationService notificationService;

    // ─── User Actions ──────────────────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(String userEmail, BookingRequest req) {
        AppUser user = userService.findByEmail(userEmail);

        UUID resourceId = UUID.fromString(req.getResourceId());
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));

        if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Resource '" + resource.getName() + "' is currently out of service.");
        }

        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End time must be after start time.");
        }

        // Conflict check
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                resourceId, req.getStartTime(), req.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This resource is already booked during the requested time slot.");
        }

        Booking booking = Booking.builder()
                .resource(resource)
                .user(user)
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .purpose(req.getPurpose())
                .attendees(req.getAttendees())
                .status(BookingStatus.PENDING)
                .build();

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String userEmail) {
        AppUser user = userService.findByEmail(userEmail);
        return bookingRepository.findByUserOrderByCreatedAtDesc(user)
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, String userEmail) {
        Booking booking = findOrThrow(bookingId);
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only cancel your own bookings.");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING bookings can be cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    // ─── Admin Actions ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getPendingBookings() {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(BookingStatus.PENDING)
                .stream().map(BookingResponse::from).toList();
    }

    @Transactional
    public BookingResponse approveBooking(UUID bookingId) {
        Booking booking = findOrThrow(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING bookings can be approved.");
        }
        booking.setStatus(BookingStatus.APPROVED);
        BookingResponse saved = BookingResponse.from(bookingRepository.save(booking));
        notificationService.notify(booking.getUser(),
                NotificationType.BOOKING_APPROVED,
                "Your booking for " + booking.getResource().getName() + " has been approved! ✅",
                bookingId.toString());
        return saved;
    }

    @Transactional
    public BookingResponse rejectBooking(UUID bookingId, String reason) {
        Booking booking = findOrThrow(bookingId);
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING bookings can be rejected.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason);
        BookingResponse saved = BookingResponse.from(bookingRepository.save(booking));
        notificationService.notify(booking.getUser(),
                NotificationType.BOOKING_REJECTED,
                "Your booking for " + booking.getResource().getName() + " was rejected."
                        + (reason != null && !reason.isBlank() ? " Reason: " + reason : ""),
                bookingId.toString());
        return saved;
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private Booking findOrThrow(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found: " + id));
    }
}
