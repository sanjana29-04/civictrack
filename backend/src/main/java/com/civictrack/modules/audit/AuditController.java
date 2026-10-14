package com.civictrack.modules.audit;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/audit")
@Tag(name = "Audit Logs", description = "Privileged system activity and compliance audit logs")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "View immutable audit trail of system events")
    public ResponseEntity<ApiResponse<PageResponse<AuditEvent>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AuditEvent> logs = auditService.getAuditLogs(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(new PageResponse<>(logs)));
    }
}
