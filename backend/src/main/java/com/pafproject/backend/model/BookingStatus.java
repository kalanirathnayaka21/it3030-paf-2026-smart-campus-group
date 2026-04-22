package com.pafproject.backend.model;

/**
 * Lifecycle states of a Booking.
 */
public enum BookingStatus {
    /** Submitted, awaiting admin review */
    PENDING,
    /** Approved by an admin */
    APPROVED,
    /** Rejected by an admin (with optional reason) */
    REJECTED,
    /** Cancelled by the booking owner */
    CANCELLED
}
