package com.pafproject.backend.repository;

import com.pafproject.backend.model.AppUser;
import com.pafproject.backend.model.Booking;
import com.pafproject.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Booking repository with custom conflict-detection and user-scoped queries.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    /**
     * Finds active bookings (PENDING or APPROVED) for a given resource that
     * overlap with the requested [startTime, endTime) window.
     *
     * Overlap condition: b.startTime < endTime AND b.endTime > startTime
     */
    @Query("""
            SELECT b FROM Booking b
            WHERE b.resource.id = :resourceId
              AND b.status IN (com.pafproject.backend.model.BookingStatus.PENDING,
                               com.pafproject.backend.model.BookingStatus.APPROVED)
              AND b.startTime < :endTime
              AND b.endTime > :startTime
            """)
    List<Booking> findConflictingBookings(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    List<Booking> findByUserOrderByCreatedAtDesc(AppUser user);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);

    long countByUserAndStatusIn(AppUser user, List<BookingStatus> statuses);
}
