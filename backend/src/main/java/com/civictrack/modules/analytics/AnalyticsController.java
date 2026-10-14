package com.civictrack.modules.analytics;

import com.civictrack.common.ApiResponse;
import com.civictrack.modules.analytics.dto.CivicAnalyticsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@Tag(name = "Civic Analytics", description = "Municipal intelligence, resolution metrics, and hotspot analysis")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/public")
    @Operation(summary = "Get high-level public community accountability statistics")
    public ResponseEntity<ApiResponse<CivicAnalyticsDto>> getPublicAnalytics() {
        CivicAnalyticsDto analytics = analyticsService.getCivicAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive operational civic intelligence analytics")
    public ResponseEntity<ApiResponse<CivicAnalyticsDto>> getDashboardAnalytics() {
        CivicAnalyticsDto analytics = analyticsService.getCivicAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}
