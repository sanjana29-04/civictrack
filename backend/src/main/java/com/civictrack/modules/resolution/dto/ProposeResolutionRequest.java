package com.civictrack.modules.resolution.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class ProposeResolutionRequest {

    @NotNull(message = "Incident ID is required")
    private UUID incidentId;

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;

    private String internalNotes;

    private String beforePhotoUrl;

    @NotBlank(message = "After/completion photographic evidence is required")
    private String afterPhotoUrl;

    private String workOrderReference;

    public ProposeResolutionRequest() {}

    public UUID getIncidentId() { return incidentId; }
    public void setIncidentId(UUID incidentId) { this.incidentId = incidentId; }
    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
    public String getInternalNotes() { return internalNotes; }
    public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }
    public String getBeforePhotoUrl() { return beforePhotoUrl; }
    public void setBeforePhotoUrl(String beforePhotoUrl) { this.beforePhotoUrl = beforePhotoUrl; }
    public String getAfterPhotoUrl() { return afterPhotoUrl; }
    public void setAfterPhotoUrl(String afterPhotoUrl) { this.afterPhotoUrl = afterPhotoUrl; }
    public String getWorkOrderReference() { return workOrderReference; }
    public void setWorkOrderReference(String workOrderReference) { this.workOrderReference = workOrderReference; }
}
