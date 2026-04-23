package com.pafproject.backend.model;

/** Lifecycle of a maintenance ticket. */
public enum TicketStatus {
    /** Newly submitted, waiting for assignment */
    OPEN,
    /** Assigned to a technician, work underway */
    IN_PROGRESS,
    /** Work completed by technician */
    RESOLVED,
    /** Confirmed closed by admin or reporter */
    CLOSED
}
