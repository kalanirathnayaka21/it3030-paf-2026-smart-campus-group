package com.pafproject.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Admin-only endpoints (secured via SecurityConfig + @PreAuthorize).
 * Extends with booking management, resource management, etc. in later phases.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to the Admin Dashboard",
            "availableActions", new String[]{
                "Manage Resources",
                "Approve/Reject Bookings",
                "View All Tickets",
                "Manage Users"
            }
        ));
    }
}
