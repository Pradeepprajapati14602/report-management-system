package com.reportmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for Report Management System
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class ReportManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReportManagementApplication.class, args);
    }
}
