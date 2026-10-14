package com.civictrack.modules.support;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incident_supports",
       uniqueConstraints = @UniqueConstraint(name = "uk_incident_user_support", columnNames = {"incident_id", "user_id"}),
       indexes = {
           @Index(name = "idx_support_incident", columnList = "incident_id"),
           @Index(name = "idx_support_user", columnList = "user_id")
       })
public class IncidentSupport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public IncidentSupport() {}

    public IncidentSupport(Incident incident, User user) {
        this.incident = incident;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
