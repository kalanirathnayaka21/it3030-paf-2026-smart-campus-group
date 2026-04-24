package com.pafproject.backend.dto;

import com.pafproject.backend.model.Ticket;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for Ticket (with denormalised reporter/assignee info).
 */
@Data
@Builder
public class TicketResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String reporterId;
    private String reporterName;
    private String reporterEmail;
    private String assignedToId;
    private String assignedToName;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketResponse from(Ticket t) {
        return TicketResponse.builder()
                .id(t.getId().toString())
                .title(t.getTitle())
                .description(t.getDescription())
                .category(t.getCategory().name())
                .priority(t.getPriority().name())
                .status(t.getStatus().name())
                .reporterId(t.getReporter().getId().toString())
                .reporterName(t.getReporter().getName())
                .reporterEmail(t.getReporter().getEmail())
                .assignedToId(t.getAssignedTo() != null ? t.getAssignedTo().getId().toString() : null)
                .assignedToName(t.getAssignedTo() != null ? t.getAssignedTo().getName() : null)
                .imageUrls(t.getImageUrls())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
