package com.reportmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for login response containing JWT token and user information
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    /**
     * JWT authentication token
     */
    private String token;

    /**
     * Type of token (typically "Bearer")
     */
    private String type;

    /**
     * User ID
     */
    private Long userId;

    /**
     * User email
     */
    private String email;
}
