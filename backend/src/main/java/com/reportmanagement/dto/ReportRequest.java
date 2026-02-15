package com.reportmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating a new report
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequest {

    @NotBlank(message = "Report name is required")
    @Size(max = 255, message = "Report name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Report type is required")
    @Size(max = 100, message = "Report type must not exceed 100 characters")
    private String type;

    @NotNull(message = "Report date is required")
    private LocalDate reportDate;
}
