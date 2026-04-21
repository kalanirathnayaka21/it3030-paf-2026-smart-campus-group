package com.pafproject.backend.dto;

import com.pafproject.backend.model.Booking;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for Booking data (includes denormalised resource and user info).
 */
@Data
@Builder
public class BookingResponse {
    private String id;
    private String resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private String userId;
    private String userName;
    private String userEmail;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
    private int attendees;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public static BookingResponse from(Booking b) {
        return BookingResponse.builder()
                .id(b.getId().toString())
                .resourceId(b.getResource().getId().toString())
                .resourceName(b.getResource().getName())
                .resourceType(b.getResource().getType().name())
                .resourceLocation(b.getResource().getLocation())
                .userId(b.getUser().getId().toString())
                .userName(b.getUser().getName())
                .userEmail(b.getUser().getEmail())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .purpose(b.getPurpose())
                .attendees(b.getAttendees())
                .status(b.getStatus().name())
                .rejectionReason(b.getRejectionReason())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
