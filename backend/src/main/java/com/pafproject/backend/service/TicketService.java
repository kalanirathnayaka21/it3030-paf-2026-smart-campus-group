package com.pafproject.backend.service;

import com.pafproject.backend.dto.TicketCommentRequest;
import com.pafproject.backend.dto.TicketCommentResponse;
import com.pafproject.backend.dto.TicketRequest;
import com.pafproject.backend.dto.TicketResponse;
import com.pafproject.backend.model.*;
import com.pafproject.backend.repository.TicketCommentRepository;
import com.pafproject.backend.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

/**
 * Business logic for the Maintenance Ticketing workflow (Module C).
 * Notifies relevant parties on key events via NotificationService.
 */
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final AppUserService userService;
    private final NotificationService notificationService;

    // ─── User Actions ──────────────────────────────────────────────────────────

    @Transactional
    public TicketResponse createTicket(String reporterEmail, TicketRequest req) {
        AppUser reporter = userService.findByEmail(reporterEmail);

        // Enforce max 3 image URLs (C.2)
        List<String> imageUrls = req.getImageUrls() != null
                ? req.getImageUrls().stream().limit(3).toList()
                : List.of();

        Ticket ticket = Ticket.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .category(req.getCategory())
                .priority(req.getPriority() != null ? req.getPriority() : TicketPriority.MEDIUM)
                .status(TicketStatus.OPEN)
                .reporter(reporter)
                .imageUrls(new java.util.ArrayList<>(imageUrls))
                .build();

        return TicketResponse.from(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(String email) {
        AppUser user = userService.findByEmail(email);
        return ticketRepository.findByReporterOrderByCreatedAtDesc(user)
                .stream().map(TicketResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getById(UUID id, String email) {
        Ticket t = findOrThrow(id);
        AppUser user = userService.findByEmail(email);
        // Owner, assignee, or admin/technician can view
        if (!t.getReporter().getId().equals(user.getId())
                && (t.getAssignedTo() == null || !t.getAssignedTo().getId().equals(user.getId()))
                && user.getRole() != Role.ADMIN && user.getRole() != Role.TECHNICIAN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied.");
        }
        return TicketResponse.from(t);
    }

    // ─── Technician / Admin Actions ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(TicketResponse::from).toList();
    }

    @Transactional
    public TicketResponse assignToSelf(UUID ticketId, String technicianEmail) {
        Ticket ticket = findOrThrow(ticketId);
        AppUser technician = userService.findByEmail(technicianEmail);
        ticket.setAssignedTo(technician);
        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }
        Ticket saved = ticketRepository.save(ticket);

        // Notify reporter
        notificationService.notify(ticket.getReporter(),
                NotificationType.TICKET_ASSIGNED,
                "Your ticket \"" + ticket.getTitle() + "\" has been assigned to " + technician.getName() + ".",
                ticketId.toString());

        return TicketResponse.from(saved);
    }

    @Transactional
    public TicketResponse updateStatus(UUID ticketId, String newStatus, String actorEmail) {
        Ticket ticket = findOrThrow(ticketId);
        TicketStatus status;
        try {
            status = TicketStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + newStatus);
        }
        ticket.setStatus(status);
        Ticket saved = ticketRepository.save(ticket);

        // Notify reporter
        notificationService.notify(ticket.getReporter(),
                NotificationType.TICKET_STATUS_CHANGED,
                "Your ticket \"" + ticket.getTitle() + "\" status changed to " + status.name() + ".",
                ticketId.toString());

        return TicketResponse.from(saved);
    }

    // ─── Comments (C.4) ────────────────────────────────────────────────────────

    @Transactional
    public TicketCommentResponse addComment(UUID ticketId, String authorEmail, TicketCommentRequest req) {
        Ticket ticket = findOrThrow(ticketId);
        AppUser author = userService.findByEmail(authorEmail);

        // Rule: only reporter, assignee, or admin/technician can comment
        boolean isReporter = ticket.getReporter().getId().equals(author.getId());
        boolean isAssignee = ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(author.getId());
        boolean isPrivileged = author.getRole() == Role.ADMIN || author.getRole() == Role.TECHNICIAN;

        if (!isReporter && !isAssignee && !isPrivileged) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the reporter, assigned technician, or admin can comment on this ticket.");
        }

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .author(author)
                .content(req.getContent())
                .build();
        TicketComment saved = commentRepository.save(comment);

        // Notify relevant parties (not the commenter themselves)
        if (!author.getId().equals(ticket.getReporter().getId())) {
            notificationService.notify(ticket.getReporter(),
                    NotificationType.NEW_COMMENT,
                    author.getName() + " commented on your ticket \"" + ticket.getTitle() + "\".",
                    ticketId.toString());
        }
        if (ticket.getAssignedTo() != null && !author.getId().equals(ticket.getAssignedTo().getId())) {
            notificationService.notify(ticket.getAssignedTo(),
                    NotificationType.NEW_COMMENT,
                    author.getName() + " commented on ticket \"" + ticket.getTitle() + "\".",
                    ticketId.toString());
        }

        return TicketCommentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<TicketCommentResponse> getComments(UUID ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream().map(TicketCommentResponse::from).toList();
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private Ticket findOrThrow(UUID id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found: " + id));
    }
}
