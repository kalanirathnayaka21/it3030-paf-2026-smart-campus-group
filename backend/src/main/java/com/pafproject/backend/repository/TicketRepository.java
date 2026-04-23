package com.pafproject.backend.repository;

import com.pafproject.backend.model.AppUser;
import com.pafproject.backend.model.Ticket;
import com.pafproject.backend.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByReporterOrderByCreatedAtDesc(AppUser reporter);

    List<Ticket> findByAssignedToOrderByCreatedAtDesc(AppUser assignedTo);

    List<Ticket> findAllByOrderByCreatedAtDesc();

    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);

    @Query("""
            SELECT t FROM Ticket t
            WHERE (:status IS NULL OR t.status = :status)
            ORDER BY t.createdAt DESC
            """)
    List<Ticket> findByOptionalStatus(@Param("status") TicketStatus status);

    long countByStatus(TicketStatus status);
}
