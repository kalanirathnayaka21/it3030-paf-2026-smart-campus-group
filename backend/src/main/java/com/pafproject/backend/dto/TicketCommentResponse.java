package com.pafproject.backend.dto;

import com.pafproject.backend.model.TicketComment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/** Response DTO for a TicketComment. */
@Data
@Builder
public class TicketCommentResponse {
    private String id;
    private String ticketId;
    private String authorId;
    private String authorName;
    private String authorPicture;
    private String content;
    private LocalDateTime createdAt;

    public static TicketCommentResponse from(TicketComment c) {
        return TicketCommentResponse.builder()
                .id(c.getId().toString())
                .ticketId(c.getTicket().getId().toString())
                .authorId(c.getAuthor().getId().toString())
                .authorName(c.getAuthor().getName())
                .authorPicture(c.getAuthor().getPicture())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
