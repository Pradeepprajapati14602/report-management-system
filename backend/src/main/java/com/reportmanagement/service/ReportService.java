package com.reportmanagement.service;

import com.reportmanagement.dto.ReportRequest;
import com.reportmanagement.dto.ReportResponse;
import com.reportmanagement.dto.StatusUpdateRequest;
import com.reportmanagement.exception.InvalidStatusTransitionException;
import com.reportmanagement.exception.ResourceNotFoundException;
import com.reportmanagement.exception.UnauthorizedException;
import com.reportmanagement.model.Report;
import com.reportmanagement.model.ReportStatus;
import com.reportmanagement.model.User;
import com.reportmanagement.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service class for handling report operations
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Get all reports for the authenticated user
     *
     * @param authentication the authentication object containing user details
     * @return list of report responses
     */
    public List<ReportResponse> getAllReports(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Report> reports = reportRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a report by ID
     *
     * @param id the report ID
     * @param authentication the authentication object
     * @return the report response
     * @throws ResourceNotFoundException if report not found
     * @throws UnauthorizedException if user doesn't own the report
     */
    public ReportResponse getReportById(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Report report = findReportAndValidateOwnership(id, user.getId());
        return mapToResponse(report);
    }

    /**
     * Create a new report with file upload
     *
     * @param file the uploaded file
     * @param request the report request containing metadata
     * @param authentication the authentication object
     * @return the created report response
     * @throws IOException if file storage fails
     */
    @Transactional
    public ReportResponse createReport(
            MultipartFile file,
            ReportRequest request,
            Authentication authentication
    ) throws IOException {
        User user = getAuthenticatedUser(authentication);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFilename = user.getId() + "_" + UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Save file
        Files.copy(file.getInputStream(), filePath);

        // Create report entity
        Report report = Report.builder()
                .user(user)
                .name(request.getName())
                .type(request.getType())
                .filePath(filePath.toString())
                .status(ReportStatus.UPLOADED)
                .reportDate(request.getReportDate())
                .build();

        // Save report
        report = reportRepository.save(report);

        return mapToResponse(report);
    }

    /**
     * Update the status of a report
     *
     * @param id the report ID
     * @param request the status update request
     * @param authentication the authentication object
     * @return the updated report response
     * @throws ResourceNotFoundException if report not found
     * @throws UnauthorizedException if user doesn't own the report
     * @throws InvalidStatusTransitionException if status transition is invalid
     */
    @Transactional
    public ReportResponse updateReportStatus(
            Long id,
            StatusUpdateRequest request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);
        Report report = findReportAndValidateOwnership(id, user.getId());

        // Validate status transition
        ReportStatus currentStatus = report.getStatus();
        ReportStatus newStatus = request.getStatus();

        if (!ReportStatus.isValidTransition(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(
                    String.format("Cannot transition from %s to %s", currentStatus, newStatus)
            );
        }

        // Update status and optionally summary
        report.setStatus(newStatus);
        if (request.getSummary() != null) {
            report.setSummary(request.getSummary());
        }

        report = reportRepository.save(report);

        return mapToResponse(report);
    }

    /**
     * Delete a report
     *
     * @param id the report ID
     * @param authentication the authentication object
     * @throws ResourceNotFoundException if report not found
     * @throws UnauthorizedException if user doesn't own the report
     */
    @Transactional
    public void deleteReport(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Report report = findReportAndValidateOwnership(id, user.getId());

        // Delete file from filesystem
        try {
            Path filePath = Paths.get(report.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        // Delete from database
        reportRepository.delete(report);
    }

    /**
     * Get authenticated user from authentication object
     */
    private User getAuthenticatedUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }

    /**
     * Find report and validate ownership
     */
    private Report findReportAndValidateOwnership(Long reportId, Long userId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", reportId));

        if (!report.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to access this report");
        }

        return report;
    }

    /**
     * Map Report entity to ReportResponse DTO
     */
    private ReportResponse mapToResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .name(report.getName())
                .type(report.getType())
                .filePath(report.getFilePath())
                .status(report.getStatus())
                .summary(report.getSummary())
                .reportDate(report.getReportDate())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}
