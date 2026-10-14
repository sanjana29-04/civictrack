package com.civictrack.modules.timeline;

import com.civictrack.modules.incident.Incident;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incident_timeline_events", indexes = {
    @Index(name = "idx_timeline_incident", columnList = "incident_id"),
    @Index(name = "idx_timeline_created_at", columnList = "createdAt")
})
public class IncidentTimelineEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private Incident incident;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private TimelineEventType eventType;

    @Column(nullable = false, length = 100)
    private String actorName;

    @Column(nullable = false, length = 50)
    private String actorRole;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(length = 500)
    private String evidenceUrl;

    @Column(nullable = false)
    private boolean isPublic = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public IncidentTimelineEvent() {}

    public IncidentTimelineEvent(Incident incident, TimelineEventType eventType, String actorName,
                                 String actorRole, String details, String evidenceUrl, boolean isPublic) {
        this.incident = incident;
        this.eventType = eventType;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.details = details;
        this.evidenceUrl = evidenceUrl;
        this.isPublic = isPublic;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public TimelineEventType getEventType() { return eventType; }
    public void setEventType(TimelineEventType eventType) { this.eventType = eventType; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getEvidenceUrl() { return evidenceUrl; }
    public void setEvidenceUrl(String evidenceUrl) { this.evidenceUrl = evidenceUrl; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
