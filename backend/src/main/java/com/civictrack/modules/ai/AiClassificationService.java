package com.civictrack.modules.ai;

import com.civictrack.modules.ai.dto.AiAnalysisRequest;
import com.civictrack.modules.ai.dto.AiAnalysisResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiClassificationService {

    private static final Logger log = LoggerFactory.getLogger(AiClassificationService.class);

    private final DeterministicFallbackAiProvider fallbackProvider;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    public AiClassificationService(DeterministicFallbackAiProvider fallbackProvider) {
        this.fallbackProvider = fallbackProvider;
    }

    public AiAnalysisResponse analyze(AiAnalysisRequest request) {
        // If an API key is provided and valid, we could dispatch to remote model.
        // If not provided or on failure, invoke the deterministic fallback provider.
        log.info("Performing AI-assisted classification using provider: {}", fallbackProvider.getProviderName());
        return fallbackProvider.analyzeIncident(request);
    }
}
