package com.pafproject.backend.model;

/**
 * Defines the roles available in the Smart Campus system.
 * <ul>
 *   <li>USER – a regular student or staff member</li>
 *   <li>ADMIN – can approve/reject bookings and manage resources</li>
 *   <li>TECHNICIAN – handles maintenance tickets</li>
 * </ul>
 */
public enum Role {
    USER,
    ADMIN,
    TECHNICIAN
}
