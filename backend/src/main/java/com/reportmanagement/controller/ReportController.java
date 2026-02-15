package com.reportmanagement.controller;

import com.reportmanagement.dto.ApiResponse;
import com.reportmanagement.dto.ReportRequest;
import com.reportmanagement.dto.ReportResponse;
import com.reportmanagement.dto.StatusUpdateRequest;
import com.reportmanagement.model.User;
import com.reportmanagement.security.CustomUserDetails;
import com.reportmanagement.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * REST Controller for report operations
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReportController {

    private final ReportService reportService;

    /**
     * Get all reports for the authenticated user
     *
     * GET /api/reports
     *
     * @param authentication the authentication object
     * @return ResponseEntity containing list of report responses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getAllReports(
            Authentication authentication
    ) {
        // Get user from authentication
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Update authentication principal to be the User entity
        var newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user,
                authentication.getCredentials(),
                authentication.getAuthorities()
        );

        List<ReportResponse> reports = reportService.getAllReports(newAuth);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    /**
     * Get a report by ID
     *
     * GET /api/reports/{id}
     *
     * @param id the report ID
     * @param authentication the authentication object
     * @return ResponseEntity containing the report response
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        var newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user,
                authentication.getCredentials(),
                authentication.getAuthorities()
        );

        ReportResponse report = reportService.getReportById(id, newAuth);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    /**
     * Create a new report with file upload
     *
     * POST /api/reports
     *
     * @param file the uploaded file
     * @param name the report name
     * @param type the report type
     * @param reportDate the report date (format: yyyy-MM-dd)
     * @param authentication the authentication object
     * @return ResponseEntity containing the created report response
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ReportResponse>> createReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("reportDate") String reportDate,
            Authentication authentication
    ) throws IOException {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        var newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user,
                authentication.getCredentials(),
                authentication.getAuthorities()
        );

        ReportRequest request = ReportRequest.builder()
                .name(name)
                .type(type)
                .reportDate(java.time.LocalDate.parse(reportDate))
                .build();

        ReportResponse report = reportService.createReport(file, request, newAuth);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Report uploaded successfully", report));
    }

    /**
     * Update report status
     *
     * PATCH /api/reports/{id}/status
     *
     * @param id the report ID
     * @param request the status update request
     * @param authentication the authentication object
     * @return ResponseEntity containing the updated report response
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReportResponse>> updateReportStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        var newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user,
                authentication.getCredentials(),
                authentication.getAuthorities()
        );

        ReportResponse report = reportService.updateReportStatus(id, request, newAuth);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", report));
    }

    /**
     * Delete a report
     *
     * DELETE /api/reports/{id}
     *
     * @param id the report ID
     * @param authentication the authentication object
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        var newAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user,
                authentication.getCredentials(),
                authentication.getAuthorities()
        );

        reportService.deleteReport(id, newAuth);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully", null));
    }
}
