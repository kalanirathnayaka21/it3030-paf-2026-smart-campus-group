package com.pafproject.backend.dto;

import com.pafproject.backend.model.ResourceStatus;
import com.pafproject.backend.model.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request DTO for creating or updating a Resource.
 */
@Data
public class ResourceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    @Min(value = 0, message = "Capacity must be non-negative")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;
    private String imageUrl;
}
