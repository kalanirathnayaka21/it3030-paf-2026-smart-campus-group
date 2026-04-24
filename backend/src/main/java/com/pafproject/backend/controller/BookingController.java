package com.pafproject.backend.controller;

import com.pafproject.backend.dto.BookingRequest;
import com.pafproject.backend.dto.BookingResponse;
import com.pafproject.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for the booking workflow.
 * <ul>
 *   <li>POST   /api/bookings              – USER/ADMIN: create booking</li>
 *   <li>GET    /api/bookings/my           – USER/ADMIN: own bookings</li>
 *   <li>DELETE /api/bookings/{id}/cancel  – USER/ADMIN: cancel own PENDING booking</li>
 *   <li>GET    /api/bookings              – ADMIN: all bookings</li>
 *   <li>GET    /api/bookings/pending      – ADMIN: pending bookings</li>
 *   <li>PATCH  /api/bookings/{id}/approve – ADMIN</li>
 *   <li>PATCH  /api/bookings/{id}/reject  – ADMIN</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService service;

    // ─── Authenticated User Endpoints ───────────────────────────────────────────

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest req,
                                                  Authentication auth) {
        String email = (String) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBooking(email, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return ResponseEntity.ok(service.getMyBookings(email));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable UUID id, Authentication auth) {
        String email = (String) auth.getPrincipal();
        return ResponseEntity.ok(service.cancelBooking(id, email));
    }

    // ─── Admin Endpoints ────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAll() {
        return ResponseEntity.ok(service.getAllBookings());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponse>> getPending() {
        return ResponseEntity.ok(service.getPendingBookings());
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(service.approveBooking(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> reject(@PathVariable UUID id,
                                                  @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        return ResponseEntity.ok(service.rejectBooking(id, reason));
    }
}
