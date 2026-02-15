package com.reportmanagement.model;

import lombok.Getter;

/**
 * Enum representing the status of a report in the processing workflow
 *
 * Status Transition Rules:
 * UPLOADED → PROCESSING → COMPLETED
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Getter
public enum ReportStatus {

    /**
     * Initial state when report is uploaded
     */
    UPLOADED("UPLOADED"),

    /**
     * Report is being processed
     */
    PROCESSING("PROCESSING"),

    /**
     * Report processing is completed
     */
    COMPLETED("COMPLETED");

    private final String value;

    ReportStatus(String value) {
        this.value = value;
    }

    /**
     * Validates if a status transition is valid
     *
     * @param currentStatus the current status
     * @param newStatus the new status to transition to
     * @return true if transition is valid, false otherwise
     */
    public static boolean isValidTransition(ReportStatus currentStatus, ReportStatus newStatus) {
        if (currentStatus == null || newStatus == null) {
            return false;
        }

        return switch (currentStatus) {
            case UPLOADED -> newStatus == PROCESSING;
            case PROCESSING -> newStatus == COMPLETED;
            case COMPLETED -> false; // Already completed, no further transitions
        };
    }

    @Override
    public String toString() {
        return value;
    }
}
