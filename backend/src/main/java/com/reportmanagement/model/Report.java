package com.reportmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Report entity representing a medical report uploaded by a user
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Entity
@Table(name = "reports",
       indexes = {
           @Index(name = "idx_reports_user_id", columnList = "user_id"),
           @Index(name = "idx_reports_status", columnList = "status"),
           @Index(name = "idx_reports_created_at", columnList = "created_at")
       })
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    /**
     * Primary key of the report
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * User who owns this report
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Name of the report
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * Type/category of the report (e.g., LAB_REPORT, IMAGING, etc.)
     */
    @Column(name = "type", nullable = false)
    private String type;

    /**
     * File system path where the report file is stored
     */
    @Column(name = "file_path", nullable = false)
    private String filePath;

    /**
     * Current status of the report in the processing workflow
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.UPLOADED;

    /**
     * Generated summary of the report
     */
    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    /**
     * Date associated with the report
     */
    @Column(name = "report_date")
    private LocalDate reportDate;

    /**
     * Timestamp when report was created
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when report was last updated
     */
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
