package com.reportmanagement.dto;

import com.reportmanagement.model.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for report response
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private Long id;
    private String name;
    private String type;
    private String filePath;
    private ReportStatus status;
    private String summary;
    private LocalDate reportDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
