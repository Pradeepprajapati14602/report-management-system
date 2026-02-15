package com.reportmanagement.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

/**
 * Flyway Migration Configuration
 *
 * Handles database migrations using Flyway
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Configuration
public class FlywayConfig {

    /**
     * Configure Flyway for production profile
     * Enables migrations and sets baseline if needed
     */
    @Bean
    @Profile("!test")
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .baselineOnMigrate(true)
                .validateOnMigrate(true)
                .outOfOrder(false)
                .locations("classpath:db/migration")
                .load();

        // Migrate on startup
        flyway.migrate();

        return flyway;
    }

    /**
     * Configure Flyway for test profile
     * Allows clean migrations for testing
     */
    @Bean
    @Profile("test")
    public Flyway flywayTest(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .cleanDisabled(false) // Allow clean for testing
                .locations("classpath:db/migration")
                .load();

        // Clean and migrate for fresh test database
        flyway.clean();
        flyway.migrate();

        return flyway;
    }
}
