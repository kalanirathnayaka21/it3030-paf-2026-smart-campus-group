package com.pafproject.backend.controller;

import com.pafproject.backend.dto.NotificationResponse;
import com.pafproject.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for the in-app notification system (Module D).
 *
 *   GET    /api/notifications/my          – all notifications for current user
 *   GET    /api/notifications/unread-count – badge count
 *   PATCH  /api/notifications/{id}/read   – mark single as read
 *   PATCH  /api/notifications/read-all    – mark all as read
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationService.getMyNotifications((String) auth.getPrincipal()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        long count = notificationService.countUnread((String) auth.getPrincipal());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id, Authentication auth) {
        notificationService.markAsRead(id, (String) auth.getPrincipal());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication auth) {
        notificationService.markAllRead((String) auth.getPrincipal());
        return ResponseEntity.noContent().build();
    }
}
