package com.civictrack.modules.ai.dto;

import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import java.util.List;

public class AiAnalysisResponse {
    private IncidentCategory suggestedCategory;
    private String executiveSummary;
    private List<String> safetyConcerns;
    private IncidentPriority suggestedPriority;
    private String priorityReasoning;
    private List<String> missingInformationSuggestions;
    private boolean humanReviewRecommended;
    private double confidenceScore;
    private boolean isSimulated;
    private String providerName;

    public AiAnalysisResponse() {}

    public IncidentCategory getSuggestedCategory() { return suggestedCategory; }
    public void setSuggestedCategory(IncidentCategory suggestedCategory) { this.suggestedCategory = suggestedCategory; }
    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }
    public List<String> getSafetyConcerns() { return safetyConcerns; }
    public void setSafetyConcerns(List<String> safetyConcerns) { this.safetyConcerns = safetyConcerns; }
    public IncidentPriority getSuggestedPriority() { return suggestedPriority; }
    public void setSuggestedPriority(IncidentPriority suggestedPriority) { this.suggestedPriority = suggestedPriority; }
    public String getPriorityReasoning() { return priorityReasoning; }
    public void setPriorityReasoning(String priorityReasoning) { this.priorityReasoning = priorityReasoning; }
    public List<String> getMissingInformationSuggestions() { return missingInformationSuggestions; }
    public void setMissingInformationSuggestions(List<String> missingInformationSuggestions) { this.missingInformationSuggestions = missingInformationSuggestions; }
    public boolean isHumanReviewRecommended() { return humanReviewRecommended; }
    public void setHumanReviewRecommended(boolean humanReviewRecommended) { this.humanReviewRecommended = humanReviewRecommended; }
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    public boolean isSimulated() { return isSimulated; }
    public void setSimulated(boolean simulated) { isSimulated = simulated; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
}
