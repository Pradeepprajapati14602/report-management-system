package com.reportmanagement.controller;

import com.reportmanagement.dto.ApiResponse;
import com.reportmanagement.dto.LoginRequest;
import com.reportmanagement.dto.LoginResponse;
import com.reportmanagement.model.User;
import com.reportmanagement.service.AuthenticationService;
import com.reportmanagement.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication operations
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Debug endpoint to verify user lookup and password matching
     *
     * GET /api/auth/debug?email=user@example.com&password=password123
     *
     * @param email the email to look up
     * @param password the password to verify
     * @return debug information
     */
    @GetMapping("/debug")
    public ResponseEntity<ApiResponse<Map<String, Object>>> debugAuth(
            @RequestParam String email,
            @RequestParam String password
    ) {
        Map<String, Object> debugInfo = new HashMap<>();

        // Check if user exists
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            debugInfo.put("userFound", false);
            debugInfo.put("email", email);
            return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                    .success(false)
                    .message("User not found")
                    .data(debugInfo)
                    .build());
        }

        User user = userOpt.get();
        debugInfo.put("userFound", true);
        debugInfo.put("userId", user.getId());
        debugInfo.put("email", user.getEmail());
        debugInfo.put("storedHash", user.getPassword());

        // Check password match
        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        debugInfo.put("passwordMatches", passwordMatches);
        debugInfo.put("providedPassword", password);

        // Generate a test hash for comparison
        String testHash = passwordEncoder.encode(password);
        debugInfo.put("testHash", testHash);
        debugInfo.put("testHashMatches", passwordEncoder.matches(password, testHash));

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Debug info")
                .data(debugInfo)
                .build());
    }

    /**
     * Login endpoint
     *
     * POST /api/auth/login
     *
     * @param loginRequest the login request containing email and password
     * @return ResponseEntity containing LoginResponse with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest
    ) {
        LoginResponse response = authenticationService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(
                "Login successful",
                response
        ));
    }
}
