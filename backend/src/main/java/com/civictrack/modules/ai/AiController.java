package com.civictrack.modules.ai;

import com.civictrack.common.ApiResponse;
import com.civictrack.modules.ai.dto.AiAnalysisRequest;
import com.civictrack.modules.ai.dto.AiAnalysisResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
@Tag(name = "AI Assistance", description = "AI-assisted triage, categorization, and priority suggestion endpoints")
public class AiController {

    private final AiClassificationService aiClassificationService;

    public AiController(AiClassificationService aiClassificationService) {
        this.aiClassificationService = aiClassificationService;
    }

    @PostMapping("/analyze")
    @Operation(summary = "Analyze incident details to suggest category, priority, safety concerns, and completeness")
    public ResponseEntity<ApiResponse<AiAnalysisResponse>> analyze(@Valid @RequestBody AiAnalysisRequest request) {
        AiAnalysisResponse response = aiClassificationService.analyze(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
