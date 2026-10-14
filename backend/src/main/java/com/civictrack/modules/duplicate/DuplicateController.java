package com.civictrack.modules.duplicate;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.PageResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.duplicate.dto.DuplicateCandidateDto;
import com.civictrack.modules.duplicate.dto.MergeIncidentRequest;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/duplicates")
@Tag(name = "Duplicate Detection & Merging", description = "Endpoints for finding, reviewing, and merging duplicate civic reports")
public class DuplicateController {

    private final DuplicateDetectionService duplicateDetectionService;
    private final DuplicateCandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public DuplicateController(DuplicateDetectionService duplicateDetectionService,
                               DuplicateCandidateRepository candidateRepository,
                               UserRepository userRepository) {
        this.duplicateDetectionService = duplicateDetectionService;
        this.candidateRepository = candidateRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/check-realtime")
    @Operation(summary = "Check for possible duplicate incidents in real-time prior to report submission")
    public ResponseEntity<ApiResponse<List<DuplicateCandidateDto>>> checkRealtime(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(required = false) IncidentCategory category,
            @RequestParam(required = false, defaultValue = "") String title,
            @RequestParam(required = false, defaultValue = "") String description) {

        List<DuplicateCandidateDto> candidates = duplicateDetectionService.findPossibleDuplicatesRealtime(
                latitude, longitude, category, title, description);

        return ResponseEntity.ok(ApiResponse.success(candidates));
    }

    @GetMapping("/candidates")
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "Get list of pending duplicate candidates for moderator review")
    public ResponseEntity<ApiResponse<PageResponse<DuplicateCandidateDto>>> getPendingCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<DuplicateCandidate> pageResult = candidateRepository.findByStatusOrderByCreatedAtDesc(
                CandidateStatus.PENDING_REVIEW, PageRequest.of(page, size));

        Page<DuplicateCandidateDto> dtoPage = pageResult.map(c -> DuplicateCandidateDto.fromEntity(c, true));
        return ResponseEntity.ok(ApiResponse.success(new PageResponse<>(dtoPage)));
    }

    @GetMapping("/incident/{incidentId}")
    @Operation(summary = "Get pending duplicate candidates linked to a specific incident")
    public ResponseEntity<ApiResponse<List<DuplicateCandidateDto>>> getCandidatesForIncident(@PathVariable UUID incidentId) {
        List<DuplicateCandidate> candidates = candidateRepository.findPendingDuplicatesForIncident(incidentId);
        List<DuplicateCandidateDto> dtos = candidates.stream()
                .map(c -> DuplicateCandidateDto.fromEntity(c, c.getSourceIncident().getId().equals(incidentId)))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(dtos));
    }

    @PostMapping("/merge")
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "Merge a confirmed duplicate report into a surviving incident")
    public ResponseEntity<ApiResponse<String>> mergeIncident(@Valid @RequestBody MergeIncidentRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User moderator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Moderator not found"));

        duplicateDetectionService.mergeIncidents(request, moderator);
        return ResponseEntity.ok(ApiResponse.success("Incidents merged successfully with complete audit trail"));
    }

    @PostMapping("/dismiss/{candidateId}")
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "Dismiss a duplicate candidate suggestion as distinct problem")
    public ResponseEntity<ApiResponse<String>> dismissCandidate(@PathVariable UUID candidateId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User moderator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Moderator not found"));

        duplicateDetectionService.dismissCandidate(candidateId, moderator);
        return ResponseEntity.ok(ApiResponse.success("Duplicate suggestion dismissed"));
    }
}
