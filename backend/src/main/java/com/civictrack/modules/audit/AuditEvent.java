package com.civictrack.modules.audit;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events", indexes = {
    @Index(name = "idx_audit_entity", columnList = "entityName, entityId"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 60)
    private String entityName;

    @Column(nullable = false, length = 64)
    private String entityId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(nullable = false, length = 100)
    private String performedBy;

    @Column(nullable = false, length = 50)
    private String userRole;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    public AuditEvent() {}

    public AuditEvent(String entityName, String entityId, String action, String performedBy, String userRole, String details) {
        this.entityName = entityName;
        this.entityId = entityId;
        this.action = action;
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.details = details;
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
