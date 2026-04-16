package com.pafproject.backend.repository;

import com.pafproject.backend.model.Resource;
import com.pafproject.backend.model.ResourceStatus;
import com.pafproject.backend.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Resource repository with a flexible filter query.
 * Supports filtering by type, status, and a keyword that matches name or location.
 */
@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    @Query("""
            SELECT r FROM Resource r
            WHERE (:type IS NULL OR r.type = :type)
              AND (:status IS NULL OR r.status = :status)
              AND (:keyword IS NULL OR
                   LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(r.location) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY r.createdAt DESC
            """)
    List<Resource> findFiltered(
            @Param("type") ResourceType type,
            @Param("status") ResourceStatus status,
            @Param("keyword") String keyword
    );

    List<Resource> findAllByOrderByCreatedAtDesc();
}
