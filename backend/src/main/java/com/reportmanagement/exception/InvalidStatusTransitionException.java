package com.reportmanagement.exception;

/**
 * Exception thrown when an invalid status transition is attempted
 *
 * @author Report Management Team
 * @version 1.0.0
 */
public class InvalidStatusTransitionException extends RuntimeException {

    public InvalidStatusTransitionException(String message) {
        super(message);
    }

    public InvalidStatusTransitionException(String fromStatus, String toStatus) {
        super(String.format("Invalid status transition from %s to %s", fromStatus, toStatus));
    }
}
