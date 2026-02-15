package com.reportmanagement.service;

import com.reportmanagement.dto.LoginRequest;
import com.reportmanagement.dto.LoginResponse;
import com.reportmanagement.model.User;
import com.reportmanagement.repository.UserRepository;
import com.reportmanagement.security.CustomUserDetails;
import com.reportmanagement.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

/**
 * Service class for handling authentication operations
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * Authenticate user with email and password
     *
     * @param loginRequest the login request containing email and password
     * @return LoginResponse containing JWT token and user information
     * @throws AuthenticationException if authentication fails
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // Authenticate the user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Get the authenticated user
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Generate JWT token
        String token = jwtTokenUtil.generateToken(authentication);

        // Build and return login response
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .build();
    }

    /**
     * Get user by email
     *
     * @param email the user's email
     * @return the User entity
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
