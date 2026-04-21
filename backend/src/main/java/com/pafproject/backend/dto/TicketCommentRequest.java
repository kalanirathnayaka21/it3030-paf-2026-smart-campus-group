package com.pafproject.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Request DTO for posting a comment on a ticket. */
@Data
public class TicketCommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;
}
