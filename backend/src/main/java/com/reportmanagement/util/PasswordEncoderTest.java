package com.reportmanagement.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class to test and verify password encoding
 *
 * Run this class to verify BCrypt password encoding is working correctly
 *
 * @author Report Management Team
 * @version 1.0.0
 */
public class PasswordEncoderTest {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String rawPassword = "password123";
        String storedHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

        System.out.println("=== Password Encoding Test ===");
        System.out.println("Raw Password: " + rawPassword);
        System.out.println("Stored Hash: " + storedHash);
        System.out.println();

        // Test 1: Verify the stored hash matches the raw password
        boolean matches = encoder.matches(rawPassword, storedHash);
        System.out.println("Test 1: Does stored hash match 'password123'? " + matches);

        // Test 2: Generate a new hash
        String newHash = encoder.encode(rawPassword);
        System.out.println("Test 2: New hash for 'password123': " + newHash);

        // Test 3: Verify the new hash matches
        boolean newMatches = encoder.matches(rawPassword, newHash);
        System.out.println("Test 3: Does new hash match 'password123'? " + newMatches);

        // Test 4: Test wrong password
        boolean wrongMatches = encoder.matches("wrongpassword", storedHash);
        System.out.println("Test 4: Does stored hash match 'wrongpassword'? " + wrongMatches);

        System.out.println();
        System.out.println("=== Summary ===");
        if (matches && newMatches && !wrongMatches) {
            System.out.println("✓ BCrypt password encoding is working correctly!");
            System.out.println("✓ The stored hash should work for login");
        } else {
            System.out.println("✗ There may be an issue with password encoding");
            System.out.println("✓ Use this new hash for 'password123': " + newHash);
        }
    }
}
