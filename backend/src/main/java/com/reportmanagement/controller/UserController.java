package com.reportmanagement.controller;

import com.reportmanagement.dto.ApiResponse;
import com.reportmanagement.dto.CreateUserRequest;
import com.reportmanagement.dto.UserResponse;
import com.reportmanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for user management operations
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    private final UserService userService;

    /**
     * Get all users
     *
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(
                "Users retrieved successfully",
                users
        ));
    }

    /**
     * Get user by ID
     *
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(
                "User retrieved successfully",
                user
        ));
    }

    /**
     * Create a new user
     *
     * POST /api/users
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success(
                "User created successfully",
                user
        ));
    }

    /**
     * Delete user by ID
     *
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(
                "User deleted successfully",
                null
        ));
    }
}
