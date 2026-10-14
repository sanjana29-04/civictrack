package com.civictrack.modules.ai;

import com.civictrack.modules.ai.dto.AiAnalysisRequest;
import com.civictrack.modules.ai.dto.AiAnalysisResponse;

public interface AiProvider {
    AiAnalysisResponse analyzeIncident(AiAnalysisRequest request);
    boolean isAvailable();
    String getProviderName();
}
