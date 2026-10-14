package com.civictrack.modules.ai;

import com.civictrack.modules.ai.dto.AiAnalysisRequest;
import com.civictrack.modules.ai.dto.AiAnalysisResponse;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class DeterministicFallbackAiProvider implements AiProvider {

    private static final Pattern POTHOLE_PATTERN = Pattern.compile("\\b(pothole|crater|asphalt|road|tarmac|cavity|bump)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern GARBAGE_PATTERN = Pattern.compile("\\b(garbage|trash|waste|dump|rubbish|litter|bins|smell|stench)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern STREETLIGHT_PATTERN = Pattern.compile("\\b(streetlight|light|lamp|dark|night|bulb|illumination|pole)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern DRAINAGE_PATTERN = Pattern.compile("\\b(drain|drainage|waterlog|clog|gutter|sewer|monsoon|overflow)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern WATER_PATTERN = Pattern.compile("\\b(water|leak|pipe|burst|pipeline|contamination|drinking)\\b", Pattern.CASE_INSENSITIVE);
    private static final Pattern FOOTPATH_PATTERN = Pattern.compile("\\b(footpath|sidewalk|pavement|pedestrian|curb|ramp|wheelchair|crossing)\\b", Pattern.CASE_INSENSITIVE);

    @Override
    public AiAnalysisResponse analyzeIncident(AiAnalysisRequest request) {
        String text = (request.getTitle() + " " + request.getDescription()).toLowerCase();
        List<String> safetyConcerns = new ArrayList<>();
        List<String> missingInfo = new ArrayList<>();

        // 1. Suggest Category
        IncidentCategory suggestedCategory = request.getUserSelectedCategory();
        if (POTHOLE_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.ROADS_POTHOLES;
            safetyConcerns.add("Risk of vehicular wheel damage, two-wheeler skidding, and pedestrian trips.");
        } else if (DRAINAGE_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.DRAINAGE_WATERLOGGING;
            safetyConcerns.add("Water stagnation presents vector-borne disease risk and pedestrian hazards.");
        } else if (STREETLIGHT_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.STREETLIGHTS;
            safetyConcerns.add("Insufficient nighttime visibility increases pedestrian vulnerability and vehicular collisions.");
        } else if (GARBAGE_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.GARBAGE_SANITATION;
            safetyConcerns.add("Public sanitation and hygiene hazard attracting strays and pests.");
        } else if (WATER_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.WATER_SUPPLY_LEAKAGE;
            safetyConcerns.add("Loss of municipal potable water supply and potential localized road foundation erosion.");
        } else if (FOOTPATH_PATTERN.matcher(text).find()) {
            suggestedCategory = IncidentCategory.FOOTPATHS_ACCESSIBILITY;
            safetyConcerns.add("Pedestrians and wheelchair users forced onto vehicular roadway.");
        } else if (suggestedCategory == null) {
            suggestedCategory = IncidentCategory.OTHER;
        }

        // 2. Safety and Severity Assessment
        IncidentPriority suggestedPriority;
        String priorityReason;

        if (text.contains("danger") || text.contains("severe") || text.contains("deep") || text.contains("collapse") || text.contains("wire")) {
            suggestedPriority = IncidentPriority.HIGH;
            priorityReason = "Detected critical safety indicators (potential acute hazard or collision hazard). Prompt triage recommended.";
            safetyConcerns.add("High probability of physical injury if unaddressed during peak commute hours.");
        } else if (text.contains("overflow") || text.contains("broken") || text.contains("blocked") || text.contains("burst")) {
            suggestedPriority = IncidentPriority.MEDIUM;
            priorityReason = "Standard active infrastructure disruption affecting local neighborhood accessibility.";
        } else {
            suggestedPriority = IncidentPriority.LOW;
            priorityReason = "Routine civic maintenance defect with localized low-impact severity.";
        }

        // 3. Completeness checks
        if (request.getPhotoUrl() == null || request.getPhotoUrl().isBlank()) {
            missingInfo.add("Photographic evidence would assist municipal field crews in sizing required repair materials.");
        }
        if (request.getDescription().length() < 30) {
            missingInfo.add("Specific location landmarks (e.g. opposite shop or house number) would expedite field verification.");
        }

        String summary = String.format("%s report: %s. Identified as %s priority.",
                suggestedCategory.getDisplayName(),
                request.getTitle().trim(),
                suggestedPriority.name());

        AiAnalysisResponse response = new AiAnalysisResponse();
        response.setSuggestedCategory(suggestedCategory);
        response.setExecutiveSummary(summary);
        response.setSafetyConcerns(safetyConcerns);
        response.setSuggestedPriority(suggestedPriority);
        response.setPriorityReasoning(priorityReason);
        response.setMissingInformationSuggestions(missingInfo);
        response.setHumanReviewRecommended(suggestedPriority == IncidentPriority.HIGH || suggestedPriority == IncidentPriority.CRITICAL);
        response.setConfidenceScore(0.85);
        response.setSimulated(true); // Explicitly labelled as demo-mode simulation!
        response.setProviderName("CivicTrack Deterministic NLP Engine (Demo Mode)");

        return response;
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public String getProviderName() {
        return "CivicTrack Deterministic Fallback";
    }
}
