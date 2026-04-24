package com.pafproject.backend.dto;

import com.pafproject.backend.model.TicketCategory;
import com.pafproject.backend.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Request DTO for creating a new Ticket.
 */
@Data
public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    private TicketPriority priority = TicketPriority.MEDIUM;

    @Size(max = 3, message = "Maximum 3 image URLs allowed")
    private List<String> imageUrls = new ArrayList<>();
}
