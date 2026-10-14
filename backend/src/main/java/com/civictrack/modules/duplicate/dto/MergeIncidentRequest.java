package com.civictrack.modules.duplicate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class MergeIncidentRequest {

    @NotNull(message = "Surviving incident ID is required")
    private UUID survivingIncidentId;

    @NotNull(message = "Duplicate incident ID is required")
    private UUID duplicateIncidentId;

    @NotBlank(message = "Merge reason must be documented")
    private String reason;

    public MergeIncidentRequest() {}

    public MergeIncidentRequest(UUID survivingIncidentId, UUID duplicateIncidentId, String reason) {
        this.survivingIncidentId = survivingIncidentId;
        this.duplicateIncidentId = duplicateIncidentId;
        this.reason = reason;
    }

    public UUID getSurvivingIncidentId() { return survivingIncidentId; }
    public void setSurvivingIncidentId(UUID survivingIncidentId) { this.survivingIncidentId = survivingIncidentId; }
    public UUID getDuplicateIncidentId() { return duplicateIncidentId; }
    public void setDuplicateIncidentId(UUID duplicateIncidentId) { this.duplicateIncidentId = duplicateIncidentId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
