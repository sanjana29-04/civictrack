package com.civictrack.modules.prioritization;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class PriorityCalculationService {

    private static final Pattern HAZARD_PATTERN = Pattern.compile(
            "\\b(danger|hazardous|accident|injury|risk|severe|collapse|burst|live wire|electrocution|cave-in|flood|deep|trapped)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern ACCESSIBILITY_PATTERN = Pattern.compile(
            "\\b(wheelchair|accessible|hospital|school|clinic|elderly|pedestrian|sidewalk|blocked)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public PriorityExplanationDto calculatePriority(Incident incident) {
        return calculatePriority(
                incident.getTitle(),
                incident.getDescription(),
                incident.getCategory(),
                incident.getPrimaryPhotoUrl() != null,
                incident.getSupportCount() != null ? incident.getSupportCount() : 0,
                incident.getCreatedAt() != null ? incident.getCreatedAt() : Instant.now()
        );
    }

    public PriorityExplanationDto calculatePriority(String title, String description,
                                                    IncidentCategory category, boolean hasPhoto,
                                                    int supportCount, Instant createdAt) {
        List<PriorityFactor> factors = new ArrayList<>();
        int score = 0;
        String combinedText = (title + " " + description).toLowerCase();

        // 1. Infrastructure Category Baseline
        int categoryBase = switch (category) {
            case ROADS_POTHOLES, DRAINAGE_WATERLOGGING -> 25;
            case WATER_SUPPLY_LEAKAGE, STREETLIGHTS -> 20;
            case FOOTPATHS_ACCESSIBILITY -> 18;
            case GARBAGE_SANITATION, PUBLIC_PROPERTY_DAMAGE -> 15;
            case OTHER -> 10;
        };
        score += categoryBase;
        factors.add(new PriorityFactor("Category Baseline", categoryBase,
                "Baseline weight for " + category.getDisplayName(), true));

        // 2. Safety Hazard Detection
        boolean hazardDetected = HAZARD_PATTERN.matcher(combinedText).find();
        if (hazardDetected) {
            score += 30;
            factors.add(new PriorityFactor("Safety Hazard Indicators", 30,
                    "Explicit hazard or danger terms identified in description", true));
        } else {
            factors.add(new PriorityFactor("Safety Hazard Indicators", 0,
                    "No critical safety hazard terminology identified", false));
        }

        // 3. Accessibility & Vulnerable Area Impact
        boolean accessDetected = ACCESSIBILITY_PATTERN.matcher(combinedText).find();
        if (accessDetected) {
            score += 20;
            factors.add(new PriorityFactor("Accessibility & Sensitive Zone", 20,
                    "Affects public pedestrian accessibility, healthcare, or school vicinity", true));
        } else {
            factors.add(new PriorityFactor("Accessibility & Sensitive Zone", 0,
                    "No specific accessibility or school/hospital area indicated", false));
        }

        // 4. Evidence Completeness
        if (hasPhoto) {
            score += 15;
            factors.add(new PriorityFactor("Evidence Completeness", 15,
                    "Verified photographic evidence attached by reporter", true));
        } else {
            factors.add(new PriorityFactor("Evidence Completeness", 0,
                    "No photographic evidence provided", false));
        }

        // 5. Citizen Support & Co-reports
        if (supportCount >= 10) {
            score += 25;
            factors.add(new PriorityFactor("High Community Support", 25,
                    "Over 10 citizens confirmed/supported this incident", true));
        } else if (supportCount >= 3) {
            score += 10;
            factors.add(new PriorityFactor("Community Support", 10,
                    supportCount + " citizens corroborated this report", true));
        } else {
            factors.add(new PriorityFactor("Community Support", 0,
                    "Initial single report pending broader community corroboration", false));
        }

        // 6. Unresolved Age
        long daysOpen = Duration.between(createdAt, Instant.now()).toDays();
        if (daysOpen > 14) {
            score += 20;
            factors.add(new PriorityFactor("Aging Unresolved Problem", 20,
                    "Issue has remained open for more than 14 days", true));
        } else if (daysOpen > 7) {
            score += 10;
            factors.add(new PriorityFactor("Aging Unresolved Problem", 10,
                    "Issue has remained open for more than 7 days", true));
        }

        // Determine priority band
        IncidentPriority priority;
        String explanation;
        if (score >= 70) {
            priority = IncidentPriority.CRITICAL;
            explanation = "Evaluated as CRITICAL (score: " + score + ") due to compounding safety concerns, high impact, or strong community corroboration.";
        } else if (score >= 50) {
            priority = IncidentPriority.HIGH;
            explanation = "Evaluated as HIGH priority (score: " + score + ") because it affects public infrastructure with observable hazards or accessibility impact.";
        } else if (score >= 30) {
            priority = IncidentPriority.MEDIUM;
            explanation = "Evaluated as MEDIUM priority (score: " + score + ") - standard civic maintenance workflow required.";
        } else {
            priority = IncidentPriority.LOW;
            explanation = "Evaluated as LOW priority (score: " + score + ") - minor civic defect with minimal immediate risk.";
        }

        return new PriorityExplanationDto(priority, score, explanation, factors);
    }
}
