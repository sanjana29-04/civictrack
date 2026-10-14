package com.civictrack.modules.incident.dto;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import com.civictrack.modules.incident.IncidentStatus;

import java.time.Instant;
import java.util.UUID;

public class IncidentMapMarkerDto {
    private UUID id;
    private String incidentNumber;
    private String title;
    private IncidentCategory category;
    private IncidentStatus status;
    private IncidentPriority priority;
    private Double latitude;
    private Double longitude;
    private Boolean isApproximateLocation;
    private String primaryPhotoUrl;
    private Integer supportCount;
    private Instant createdAt;

    public IncidentMapMarkerDto() {}

    public static IncidentMapMarkerDto fromEntity(Incident entity) {
        IncidentMapMarkerDto dto = new IncidentMapMarkerDto();
        dto.setId(entity.getId());
        dto.setIncidentNumber(entity.getIncidentNumber());
        dto.setTitle(entity.getTitle());
        dto.setCategory(entity.getCategory());
        dto.setStatus(entity.getStatus());
        dto.setPriority(entity.getPriority());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setIsApproximateLocation(entity.getIsApproximateLocation());
        dto.setPrimaryPhotoUrl(entity.getPrimaryPhotoUrl());
        dto.setSupportCount(entity.getSupportCount());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getIncidentNumber() { return incidentNumber; }
    public void setIncidentNumber(String incidentNumber) { this.incidentNumber = incidentNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public IncidentCategory getCategory() { return category; }
    public void setCategory(IncidentCategory category) { this.category = category; }
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public IncidentPriority getPriority() { return priority; }
    public void setPriority(IncidentPriority priority) { this.priority = priority; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Boolean getIsApproximateLocation() { return isApproximateLocation; }
    public void setIsApproximateLocation(Boolean approximateLocation) { isApproximateLocation = approximateLocation; }
    public String getPrimaryPhotoUrl() { return primaryPhotoUrl; }
    public void setPrimaryPhotoUrl(String primaryPhotoUrl) { this.primaryPhotoUrl = primaryPhotoUrl; }
    public Integer getSupportCount() { return supportCount; }
    public void setSupportCount(Integer supportCount) { this.supportCount = supportCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
