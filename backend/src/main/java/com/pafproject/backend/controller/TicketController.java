package com.pafproject.backend.controller;

import com.pafproject.backend.dto.TicketCommentRequest;
import com.pafproject.backend.dto.TicketCommentResponse;
import com.pafproject.backend.dto.TicketRequest;
import com.pafproject.backend.dto.TicketResponse;
import com.pafproject.backend.service.TicketService;
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
 * REST controller for the Maintenance Ticketing system (Module C).
 *
 * User endpoints:
 *   POST   /api/tickets            – submit ticket
 *   GET    /api/tickets/my         – own tickets
 *   GET    /api/tickets/{id}       – detail (owner/assignee/admin)
 *   POST   /api/tickets/{id}/comments  – add comment
 *   GET    /api/tickets/{id}/comments  – list comments
 *
 * Technician/Admin endpoints:
 *   GET    /api/tickets            – all tickets (TECHNICIAN|ADMIN)
 *   PATCH  /api/tickets/{id}/assign  – assign to self (TECHNICIAN|ADMIN)
 *   PATCH  /api/tickets/{id}/status  – update status (TECHNICIAN|ADMIN)
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // ─── User ──────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody TicketRequest req,
                                                 Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.createTicket((String) auth.getPrincipal(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(Authentication auth) {
        return ResponseEntity.ok(ticketService.getMyTickets((String) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getById(@PathVariable UUID id, Authentication auth) {
        return ResponseEntity.ok(ticketService.getById(id, (String) auth.getPrincipal()));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketCommentResponse> addComment(@PathVariable UUID id,
                                                            @Valid @RequestBody TicketCommentRequest req,
                                                            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.addComment(id, (String) auth.getPrincipal(), req));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketCommentResponse>> getComments(@PathVariable UUID id) {
        return ResponseEntity.ok(ticketService.getComments(id));
    }

    // ─── Technician / Admin ────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> assignToSelf(@PathVariable UUID id, Authentication auth) {
        return ResponseEntity.ok(ticketService.assignToSelf(id, (String) auth.getPrincipal()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('TECHNICIAN') or hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> updateStatus(@PathVariable UUID id,
                                                       @RequestBody Map<String, String> body,
                                                       Authentication auth) {
        String newStatus = body.getOrDefault("status", "");
        return ResponseEntity.ok(ticketService.updateStatus(id, newStatus, (String) auth.getPrincipal()));
    }
}
