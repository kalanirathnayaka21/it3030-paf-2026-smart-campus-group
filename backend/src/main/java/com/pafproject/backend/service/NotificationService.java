package com.pafproject.backend.service;

import com.pafproject.backend.dto.NotificationResponse;
import com.pafproject.backend.model.AppUser;
import com.pafproject.backend.model.Notification;
import com.pafproject.backend.model.NotificationType;
import com.pafproject.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Creates and manages in-app notifications for booking and ticket events.
 * Called by BookingService and TicketService after key state changes.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AppUserService userService;

    // ─── Creation ─────────────────────────────────────────────────────────────

    public void notify(AppUser recipient, NotificationType type, String message, String relatedEntityId) {
        try {
            Notification n = Notification.builder()
                    .recipient(recipient)
                    .type(type)
                    .message(message)
                    .relatedEntityId(relatedEntityId)
                    .isRead(false)
                    .build();
            notificationRepository.save(n);
        } catch (Exception ex) {
            log.error("Failed to create notification for {}: {}", recipient.getEmail(), ex.getMessage());
        }
    }

    // ─── User Queries ──────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(String email) {
        AppUser user = userService.findByEmail(email);
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream().map(NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(String email) {
        AppUser user = userService.findByEmail(email);
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markAsRead(UUID notificationId, String email) {
        AppUser user = userService.findByEmail(email);
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getRecipient().getId().equals(user.getId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllRead(String email) {
        AppUser user = userService.findByEmail(email);
        notificationRepository.markAllReadForUser(user);
    }
}
