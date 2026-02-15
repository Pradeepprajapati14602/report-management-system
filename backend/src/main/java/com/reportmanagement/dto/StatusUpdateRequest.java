package com.reportmanagement.dto;

import com.reportmanagement.model.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating report status
 *
 * @author Report Management Team
 * @version 1.0.0
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ReportStatus status;

    /**
     * Optional summary to be added when status is updated
     */
    private String summary;
}
