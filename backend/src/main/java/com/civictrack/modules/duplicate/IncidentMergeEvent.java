package com.civictrack.modules.duplicate;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incident_merge_events", indexes = {
    @Index(name = "idx_merge_surviving", columnList = "surviving_incident_id"),
    @Index(name = "idx_merge_duplicate", columnList = "duplicate_incident_id")
})
public class IncidentMergeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surviving_incident_id", nullable = false)
    private Incident survivingIncident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duplicate_incident_id", nullable = false)
    private Incident duplicateIncident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merged_by_id", nullable = false)
    private User mergedBy;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private Integer originalSupportCountTransferred = 0;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public IncidentMergeEvent() {}

    public IncidentMergeEvent(Incident survivingIncident, Incident duplicateIncident, User mergedBy,
                              String reason, Integer originalSupportCountTransferred) {
        this.survivingIncident = survivingIncident;
        this.duplicateIncident = duplicateIncident;
        this.mergedBy = mergedBy;
        this.reason = reason;
        this.originalSupportCountTransferred = originalSupportCountTransferred;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getSurvivingIncident() { return survivingIncident; }
    public void setSurvivingIncident(Incident survivingIncident) { this.survivingIncident = survivingIncident; }
    public Incident getDuplicateIncident() { return duplicateIncident; }
    public void setDuplicateIncident(Incident duplicateIncident) { this.duplicateIncident = duplicateIncident; }
    public User getMergedBy() { return mergedBy; }
    public void setMergedBy(User mergedBy) { this.mergedBy = mergedBy; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Integer getOriginalSupportCountTransferred() { return originalSupportCountTransferred; }
    public void setOriginalSupportCountTransferred(Integer originalSupportCountTransferred) { this.originalSupportCountTransferred = originalSupportCountTransferred; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
