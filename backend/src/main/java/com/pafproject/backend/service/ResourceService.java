package com.pafproject.backend.service;

import com.pafproject.backend.dto.ResourceRequest;
import com.pafproject.backend.dto.ResourceResponse;
import com.pafproject.backend.model.Resource;
import com.pafproject.backend.model.ResourceStatus;
import com.pafproject.backend.model.ResourceType;
import com.pafproject.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Business logic for campus resource management.
 */
@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository repository;

    /** Returns all resources, optionally filtered by type, status and keyword. */
    @Transactional(readOnly = true)
    public List<ResourceResponse> search(ResourceType type, ResourceStatus status, String keyword) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return repository.findFiltered(type, status, kw)
                .stream()
                .map(ResourceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResourceResponse findById(UUID id) {
        return repository.findById(id)
                .map(ResourceResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }

    /** Admin – create a new resource. */
    @Transactional
    public ResourceResponse create(ResourceRequest req) {
        Resource resource = Resource.builder()
                .name(req.getName())
                .type(req.getType())
                .status(req.getStatus())
                .capacity(req.getCapacity())
                .location(req.getLocation())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .build();
        return ResourceResponse.from(repository.save(resource));
    }

    /** Admin – update an existing resource. */
    @Transactional
    public ResourceResponse update(UUID id, ResourceRequest req) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
        resource.setName(req.getName());
        resource.setType(req.getType());
        resource.setStatus(req.getStatus());
        resource.setCapacity(req.getCapacity());
        resource.setLocation(req.getLocation());
        resource.setDescription(req.getDescription());
        resource.setImageUrl(req.getImageUrl());
        return ResourceResponse.from(repository.save(resource));
    }

    /** Admin – delete a resource. */
    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found: " + id);
        }
        repository.deleteById(id);
    }

    /** Simple runtime exception for 404 cases. */
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String msg) { super(msg); }
    }
}
