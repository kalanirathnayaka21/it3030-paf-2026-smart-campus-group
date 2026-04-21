package com.pafproject.backend.controller;

import com.pafproject.backend.dto.ResourceRequest;
import com.pafproject.backend.dto.ResourceResponse;
import com.pafproject.backend.model.ResourceStatus;
import com.pafproject.backend.model.ResourceType;
import com.pafproject.backend.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for campus resource management.
 * <ul>
 *   <li>GET  /api/resources          – all authenticated users</li>
 *   <li>GET  /api/resources/{id}     – all authenticated users</li>
 *   <li>POST /api/resources          – ADMIN only</li>
 *   <li>PUT  /api/resources/{id}     – ADMIN only</li>
 *   <li>DELETE /api/resources/{id}   – ADMIN only</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService service;

    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAll(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.search(type, status, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> create(@Valid @RequestBody ResourceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponse> update(@PathVariable UUID id,
                                                   @Valid @RequestBody ResourceRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
