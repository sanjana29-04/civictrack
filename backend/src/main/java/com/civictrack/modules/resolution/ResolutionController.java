package com.civictrack.modules.resolution;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.resolution.dto.CitizenReviewRequest;
import com.civictrack.modules.resolution.dto.ProposeResolutionRequest;
import com.civictrack.modules.resolution.dto.ResolutionEvidenceDto;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/resolution")
@Tag(name = "Resolution Verification", description = "Endpoints for proposing, confirming, and challenging incident resolutions")
public class ResolutionController {

    private final ResolutionService resolutionService;
    private final UserRepository userRepository;

    public ResolutionController(ResolutionService resolutionService, UserRepository userRepository) {
        this.resolutionService = resolutionService;
        this.userRepository = userRepository;
    }

    @PostMapping("/propose")
    @PreAuthorize("hasAuthority('ROLE_OPERATIONS')")
    @Operation(summary = "Operations staff proposes completion of an incident with photo evidence")
    public ResponseEntity<ApiResponse<String>> proposeResolution(@Valid @RequestBody ProposeResolutionRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User staffUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        resolutionService.proposeResolution(request, staffUser);
        return ResponseEntity.ok(ApiResponse.success("Resolution proposed successfully and submitted for community verification"));
    }

    @PostMapping("/review")
    @Operation(summary = "Citizen confirms resolution or challenges with dispute evidence")
    public ResponseEntity<ApiResponse<String>> submitReview(@Valid @RequestBody CitizenReviewRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User citizen = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        resolutionService.submitCitizenReview(request, citizen);
        String msg = (request.getReviewType() == ReviewType.CONFIRMATION)
                ? "Resolution confirmed. Thank you for verifying!"
                : "Resolution challenge submitted. The incident has been reopened for operational review.";

        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @GetMapping("/incident/{incidentId}")
    @Operation(summary = "Get latest resolution evidence and community verification feedback for an incident")
    public ResponseEntity<ApiResponse<ResolutionEvidenceDto>> getIncidentEvidence(@PathVariable UUID incidentId) {
        ResolutionEvidenceDto dto = resolutionService.getLatestEvidenceForIncident(incidentId);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
