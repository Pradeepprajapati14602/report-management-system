package com.reportmanagement.exception;

/**
 * Exception thrown when a user is not authorized to perform an action
 *
 * @author Report Management Team
 * @version 1.0.0
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
