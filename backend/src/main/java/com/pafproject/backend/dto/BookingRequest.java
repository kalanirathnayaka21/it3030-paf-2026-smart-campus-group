package com.pafproject.backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Request DTO for creating a new Booking.
 */
@Data
public class BookingRequest {

    @NotNull(message = "Resource ID is required")
    private String resourceId;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "At least 1 attendee is required")
    private int attendees;
}
