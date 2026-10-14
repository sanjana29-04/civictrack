package com.civictrack.modules.incident;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.PageResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.incident.dto.*;
import com.civictrack.modules.timeline.IncidentTimelineEvent;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incidents")
@Tag(name = "Incidents", description = "Core reporting, tracking, status transitions, and geographic queries")
public class IncidentController {

    private final IncidentService incidentService;
    private final UserRepository userRepository;
    private final TimelineService timelineService;

    public IncidentController(IncidentService incidentService,
                              UserRepository userRepository,
                              TimelineService timelineService) {
        this.incidentService = incidentService;
        this.userRepository = userRepository;
        this.timelineService = timelineService;
    }

    @PostMapping
    @Operation(summary = "Submit a new civic incident report with location and photograph")
    public ResponseEntity<ApiResponse<IncidentDto>> createIncident(@Valid @RequestBody CreateIncidentRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        IncidentDto dto = incidentService.createIncident(request, reporter);
        return new ResponseEntity<>(ApiResponse.success("Incident reported successfully", dto), HttpStatus.CREATED);
    }

    @GetMapping("/explore")
    @Operation(summary = "Search and filter public incidents with pagination")
    public ResponseEntity<ApiResponse<PageResponse<IncidentDto>>> exploreIncidents(
            @RequestParam(required = false) IncidentCategory category,
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentPriority priority,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String team,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(defaultValue = "true") Boolean excludeMerged,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<IncidentDto> response = incidentService.findIncidents(
                category, status, priority, search, team, startDate, endDate, excludeMerged, pageable);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/map")
    @Operation(summary = "Get lightweight incident markers for interactive Leaflet map")
    public ResponseEntity<ApiResponse<List<IncidentMapMarkerDto>>> getMapMarkers() {
        List<IncidentMapMarkerDto> markers = incidentService.getMapMarkers();
        return ResponseEntity.ok(ApiResponse.success(markers));
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Get list of incidents submitted by the authenticated citizen")
    public ResponseEntity<ApiResponse<PageResponse<IncidentDto>>> getMyReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<IncidentDto> response = incidentService.findMyReports(reporter, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get comprehensive details of a single incident")
    public ResponseEntity<ApiResponse<IncidentDto>> getIncidentById(@PathVariable UUID id) {
        IncidentDto dto = incidentService.getIncidentById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/{id}/timeline")
    @Operation(summary = "Get immutable accountability timeline events for an incident")
    public ResponseEntity<ApiResponse<List<IncidentTimelineEvent>>> getTimeline(@PathVariable UUID id) {
        boolean isPrivileged = SecurityUtils.hasRole(Role.ROLE_MODERATOR) || SecurityUtils.hasRole(Role.ROLE_OPERATIONS);
        List<IncidentTimelineEvent> timeline = timelineService.getTimelineForIncident(id, isPrivileged);
        return ResponseEntity.ok(ApiResponse.success(timeline));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "Update incident status, priority, or category with mandatory audit reason")
    public ResponseEntity<ApiResponse<IncidentDto>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIncidentStatusRequest request) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User modifier = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Modifier not found"));

        IncidentDto updated = incidentService.updateIncidentStatus(id, request, modifier);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", updated));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ROLE_OPERATIONS')")
    @Operation(summary = "Assign incident to municipal field team and staff")
    public ResponseEntity<ApiResponse<IncidentDto>> assignIncident(
            @PathVariable UUID id,
            @Valid @RequestBody AssignIncidentRequest request) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User assigner = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Assigner not found"));

        IncidentDto assigned = incidentService.assignIncident(id, request, assigner);
        return ResponseEntity.ok(ApiResponse.success("Incident assigned successfully", assigned));
    }
}
