package com.civictrack.modules.support;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.common.exceptions.UnauthorizedException;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/incidents/{incidentId}/support")
@Tag(name = "Incident Support", description = "Endpoints for community endorsement/support of incidents")
public class SupportController {

    private final SupportService supportService;
    private final UserRepository userRepository;

    public SupportController(SupportService supportService, UserRepository userRepository) {
        this.supportService = supportService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @Operation(summary = "Toggle endorsement support for an incident")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleSupport(@PathVariable UUID incidentId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Must be logged in to support an incident"));
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean supported = supportService.toggleSupport(incidentId, user);

        return ResponseEntity.ok(ApiResponse.success(
                supported ? "Endorsement added" : "Endorsement removed",
                Map.of("supported", supported)
        ));
    }

    @GetMapping("/status")
    @Operation(summary = "Check whether current user has supported an incident")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkStatus(@PathVariable UUID incidentId) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        boolean supported = supportService.hasUserSupported(incidentId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("supported", supported)));
    }
}
