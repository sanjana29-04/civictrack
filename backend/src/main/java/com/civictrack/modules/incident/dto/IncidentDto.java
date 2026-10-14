package com.civictrack.modules.incident.dto;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import com.civictrack.modules.incident.IncidentStatus;

import java.time.Instant;
import java.util.UUID;

public class IncidentDto {
    private UUID id;
    private String incidentNumber;
    private String title;
    private String description;
    private IncidentCategory category;
    private String categoryDisplayName;
    private IncidentStatus status;
    private String statusDisplayName;
    private IncidentPriority priority;
    private String priorityReason;

    // AI suggestions & explainability
    private IncidentCategory aiSuggestedCategory;
    private IncidentPriority aiSuggestedPriority;
    private String aiPriorityReason;
    private Double aiConfidence;
    private Boolean aiSimulated;

    // Geography
    private Double latitude;
    private Double longitude;
    private String address;
    private String landmark;
    private Boolean isApproximateLocation;

    private String primaryPhotoUrl;

    // Reporter & Staff
    private UUID reporterId;
    private String reporterName;
    private String assignedTeam;
    private String assignedStaffName;

    // Engagement & Audit
    private Integer supportCount;
    private Integer duplicateCount;
    private UUID mergedIntoId;
    private String mergedIntoNumber;
    private String officialReferenceNumber;

    private Instant createdAt;
    private Instant updatedAt;
    private Instant resolvedAt;
    private Instant closedAt;

    public IncidentDto() {}

    public static IncidentDto fromEntity(Incident entity) {
        if (entity == null) return null;

        IncidentDto dto = new IncidentDto();
        dto.setId(entity.getId());
        dto.setIncidentNumber(entity.getIncidentNumber());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setCategoryDisplayName(entity.getCategory() != null ? entity.getCategory().getDisplayName() : "");
        dto.setStatus(entity.getStatus());
        dto.setStatusDisplayName(entity.getStatus() != null ? entity.getStatus().getDisplayName() : "");
        dto.setPriority(entity.getPriority());
        dto.setPriorityReason(entity.getPriorityReason());

        dto.setAiSuggestedCategory(entity.getAiSuggestedCategory());
        dto.setAiSuggestedPriority(entity.getAiSuggestedPriority());
        dto.setAiPriorityReason(entity.getAiPriorityReason());
        dto.setAiConfidence(entity.getAiConfidence());
        dto.setAiSimulated(entity.getAiSimulated());

        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setAddress(entity.getAddress());
        dto.setLandmark(entity.getLandmark());
        dto.setIsApproximateLocation(entity.getIsApproximateLocation());
        dto.setPrimaryPhotoUrl(entity.getPrimaryPhotoUrl());

        if (entity.getReporter() != null) {
            dto.setReporterId(entity.getReporter().getId());
            dto.setReporterName(entity.getReporter().getFullName());
        }

        dto.setAssignedTeam(entity.getAssignedTeam());
        if (entity.getAssignedStaff() != null) {
            dto.setAssignedStaffName(entity.getAssignedStaff().getFullName());
        }

        dto.setSupportCount(entity.getSupportCount());
        dto.setDuplicateCount(entity.getDuplicateCount());

        if (entity.getMergedIntoIncident() != null) {
            dto.setMergedIntoId(entity.getMergedIntoIncident().getId());
            dto.setMergedIntoNumber(entity.getMergedIntoIncident().getIncidentNumber());
        }

        dto.setOfficialReferenceNumber(entity.getOfficialReferenceNumber());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setResolvedAt(entity.getResolvedAt());
        dto.setClosedAt(entity.getClosedAt());

        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getIncidentNumber() { return incidentNumber; }
    public void setIncidentNumber(String incidentNumber) { this.incidentNumber = incidentNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public IncidentCategory getCategory() { return category; }
    public void setCategory(IncidentCategory category) { this.category = category; }
    public String getCategoryDisplayName() { return categoryDisplayName; }
    public void setCategoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; }
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public String getStatusDisplayName() { return statusDisplayName; }
    public void setStatusDisplayName(String statusDisplayName) { this.statusDisplayName = statusDisplayName; }
    public IncidentPriority getPriority() { return priority; }
    public void setPriority(IncidentPriority priority) { this.priority = priority; }
    public String getPriorityReason() { return priorityReason; }
    public void setPriorityReason(String priorityReason) { this.priorityReason = priorityReason; }
    public IncidentCategory getAiSuggestedCategory() { return aiSuggestedCategory; }
    public void setAiSuggestedCategory(IncidentCategory aiSuggestedCategory) { this.aiSuggestedCategory = aiSuggestedCategory; }
    public IncidentPriority getAiSuggestedPriority() { return aiSuggestedPriority; }
    public void setAiSuggestedPriority(IncidentPriority aiSuggestedPriority) { this.aiSuggestedPriority = aiSuggestedPriority; }
    public String getAiPriorityReason() { return aiPriorityReason; }
    public void setAiPriorityReason(String aiPriorityReason) { this.aiPriorityReason = aiPriorityReason; }
    public Double getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(Double aiConfidence) { this.aiConfidence = aiConfidence; }
    public Boolean getAiSimulated() { return aiSimulated; }
    public void setAiSimulated(Boolean aiSimulated) { this.aiSimulated = aiSimulated; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
    public Boolean getIsApproximateLocation() { return isApproximateLocation; }
    public void setIsApproximateLocation(Boolean approximateLocation) { isApproximateLocation = approximateLocation; }
    public String getPrimaryPhotoUrl() { return primaryPhotoUrl; }
    public void setPrimaryPhotoUrl(String primaryPhotoUrl) { this.primaryPhotoUrl = primaryPhotoUrl; }
    public UUID getReporterId() { return reporterId; }
    public void setReporterId(UUID reporterId) { this.reporterId = reporterId; }
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }
    public String getAssignedStaffName() { return assignedStaffName; }
    public void setAssignedStaffName(String assignedStaffName) { this.assignedStaffName = assignedStaffName; }
    public Integer getSupportCount() { return supportCount; }
    public void setSupportCount(Integer supportCount) { this.supportCount = supportCount; }
    public Integer getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(Integer duplicateCount) { this.duplicateCount = duplicateCount; }
    public UUID getMergedIntoId() { return mergedIntoId; }
    public void setMergedIntoId(UUID mergedIntoId) { this.mergedIntoId = mergedIntoId; }
    public String getMergedIntoNumber() { return mergedIntoNumber; }
    public void setMergedIntoNumber(String mergedIntoNumber) { this.mergedIntoNumber = mergedIntoNumber; }
    public String getOfficialReferenceNumber() { return officialReferenceNumber; }
    public void setOfficialReferenceNumber(String officialReferenceNumber) { this.officialReferenceNumber = officialReferenceNumber; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }
}
