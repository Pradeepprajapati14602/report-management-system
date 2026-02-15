package com.reportmanagement.repository;

import com.reportmanagement.model.Report;
import com.reportmanagement.model.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Report entity
 *
 * Provides data access operations for Report entities
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    /**
     * Find all reports for a specific user, ordered by creation date descending
     *
     * @param userId the ID of the user
     * @return list of reports ordered by createdAt DESC
     */
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find reports for a specific user with pagination
     *
     * @param userId the ID of the user
     * @param pageable pagination parameters
     * @return page of reports
     */
    Page<Report> findByUserId(Long userId, Pageable pageable);

    /**
     * Find reports for a specific user filtered by status
     *
     * @param userId the ID of the user
     * @param status the status to filter by
     * @return list of reports with the specified status
     */
    List<Report> findByUserIdAndStatus(Long userId, ReportStatus status);

    /**
     * Find a report by ID and user ID (ensures user can only access their own reports)
     *
     * @param id the report ID
     * @param userId the user ID
     * @return Optional containing the report if found and belongs to user
     */
    @Query("SELECT r FROM Report r WHERE r.id = :id AND r.user.id = :userId")
    List<Report> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);

    /**
     * Count reports by user ID and status
     *
     * @param userId the ID of the user
     * @param status the status to count
     * @return count of reports with the specified status
     */
    long countByUserIdAndStatus(Long userId, ReportStatus status);
}
