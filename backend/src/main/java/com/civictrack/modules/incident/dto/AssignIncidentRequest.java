package com.civictrack.modules.incident.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class AssignIncidentRequest {

    @NotBlank(message = "Assigned team name is required")
    private String assignedTeam;

    private UUID assignedStaffId;

    private String notes;

    public AssignIncidentRequest() {}

    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }
    public UUID getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(UUID assignedStaffId) { this.assignedStaffId = assignedStaffId; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
