package com.pafproject.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Technician (and Admin) endpoints.
 * Extends with ticket management workflows in Phase 4.
 */
@RestController
@RequestMapping("/api/technician")
@PreAuthorize("hasAnyRole('TECHNICIAN','ADMIN')")
public class TechnicianController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to the Technician Dashboard",
            "availableActions", new String[]{
                "View Assigned Tickets",
                "Update Ticket Status",
                "Add Comments to Tickets"
            }
        ));
    }
}
