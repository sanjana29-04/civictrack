package com.civictrack.modules.incident.dto;

import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import com.civictrack.modules.incident.IncidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateIncidentStatusRequest {

    @NotNull(message = "New status is required")
    private IncidentStatus status;

    private IncidentPriority priority;

    private IncidentCategory category;

    @NotBlank(message = "Reason or note for status transition is required for audit history")
    private String reason;

    private String officialReferenceNumber;

    public UpdateIncidentStatusRequest() {}

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public IncidentPriority getPriority() { return priority; }
    public void setPriority(IncidentPriority priority) { this.priority = priority; }
    public IncidentCategory getCategory() { return category; }
    public void setCategory(IncidentCategory category) { this.category = category; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getOfficialReferenceNumber() { return officialReferenceNumber; }
    public void setOfficialReferenceNumber(String officialReferenceNumber) { this.officialReferenceNumber = officialReferenceNumber; }
}
