package com.civictrack.modules.prioritization;

import com.civictrack.modules.incident.IncidentPriority;
import java.util.List;

public class PriorityExplanationDto {
    private IncidentPriority calculatedPriority;
    private int totalScore;
    private String readableExplanation;
    private List<PriorityFactor> factors;

    public PriorityExplanationDto() {}

    public PriorityExplanationDto(IncidentPriority calculatedPriority, int totalScore,
                                  String readableExplanation, List<PriorityFactor> factors) {
        this.calculatedPriority = calculatedPriority;
        this.totalScore = totalScore;
        this.readableExplanation = readableExplanation;
        this.factors = factors;
    }

    public IncidentPriority getCalculatedPriority() { return calculatedPriority; }
    public void setCalculatedPriority(IncidentPriority calculatedPriority) { this.calculatedPriority = calculatedPriority; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public String getReadableExplanation() { return readableExplanation; }
    public void setReadableExplanation(String readableExplanation) { this.readableExplanation = readableExplanation; }
    public List<PriorityFactor> getFactors() { return factors; }
    public void setFactors(List<PriorityFactor> factors) { this.factors = factors; }
}
