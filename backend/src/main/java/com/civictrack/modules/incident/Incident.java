package com.civictrack.modules.incident;

import com.civictrack.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incident_number", columnList = "incidentNumber", unique = true),
    @Index(name = "idx_incident_status", columnList = "status"),
    @Index(name = "idx_incident_category", columnList = "category"),
    @Index(name = "idx_incident_priority", columnList = "priority"),
    @Index(name = "idx_incident_geo", columnList = "latitude, longitude"),
    @Index(name = "idx_incident_created_at", columnList = "createdAt")
})
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 32)
    private String incidentNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentStatus status = IncidentStatus.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private IncidentPriority priority = IncidentPriority.MEDIUM;

    @Column(columnDefinition = "TEXT")
    private String priorityReason;

    // AI suggestions (audit trail of model recommendations vs human confirmation)
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private IncidentCategory aiSuggestedCategory;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private IncidentPriority aiSuggestedPriority;

    @Column(columnDefinition = "TEXT")
    private String aiPriorityReason;

    private Double aiConfidence;

    private Boolean aiSimulated = true;

    // Geographic data
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 255)
    private String address;

    @Column(length = 200)
    private String landmark;

    @Column(nullable = false)
    private Boolean isApproximateLocation = false;

    // Primary photo / attachment
    @Column(length = 500)
    private String primaryPhotoUrl;

    // Reporter and Assignment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(length = 100)
    private String assignedTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;

    // Metrics
    @Column(nullable = false)
    private Integer supportCount = 0;

    @Column(nullable = false)
    private Integer duplicateCount = 0;

    // Merging
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merged_into_id")
    @JsonIgnore
    private Incident mergedIntoIncident;

    @Column(length = 100)
    private String officialReferenceNumber;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private Instant resolvedAt;
    private Instant closedAt;

    public Incident() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.supportCount == null) this.supportCount = 0;
        if (this.duplicateCount == null) this.duplicateCount = 0;
        if (this.isApproximateLocation == null) this.isApproximateLocation = false;
        if (this.status == null) this.status = IncidentStatus.SUBMITTED;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
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
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
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
    public void setIsApproximateLocation(Boolean isApproximateLocation) { this.isApproximateLocation = isApproximateLocation; }
    public String getPrimaryPhotoUrl() { return primaryPhotoUrl; }
    public void setPrimaryPhotoUrl(String primaryPhotoUrl) { this.primaryPhotoUrl = primaryPhotoUrl; }
    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }
    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }
    public User getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; }
    public Integer getSupportCount() { return supportCount; }
    public void setSupportCount(Integer supportCount) { this.supportCount = supportCount; }
    public Integer getDuplicateCount() { return duplicateCount; }
    public void setDuplicateCount(Integer duplicateCount) { this.duplicateCount = duplicateCount; }
    public Incident getMergedIntoIncident() { return mergedIntoIncident; }
    public void setMergedIntoIncident(Incident mergedIntoIncident) { this.mergedIntoIncident = mergedIntoIncident; }
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
