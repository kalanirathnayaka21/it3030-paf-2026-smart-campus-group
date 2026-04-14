package com.pafproject.backend.dto;

import com.pafproject.backend.model.Resource;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Response DTO for Resource data.
 */
@Data
@Builder
public class ResourceResponse {
    private String id;
    private String name;
    private String type;
    private String status;
    private int capacity;
    private String location;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public static ResourceResponse from(Resource r) {
        return ResourceResponse.builder()
                .id(r.getId().toString())
                .name(r.getName())
                .type(r.getType().name())
                .status(r.getStatus().name())
                .capacity(r.getCapacity())
                .location(r.getLocation())
                .description(r.getDescription())
                .imageUrl(r.getImageUrl())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
