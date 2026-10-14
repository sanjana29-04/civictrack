package com.civictrack.modules.resolution;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resolution_evidences", indexes = {
    @Index(name = "idx_res_incident", columnList = "incident_id")
})
public class ResolutionEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposed_by_id", nullable = false)
    private User proposedBy;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(columnDefinition = "TEXT")
    private String internalNotes;

    @Column(length = 500)
    private String beforePhotoUrl;

    @Column(nullable = false, length = 500)
    private String afterPhotoUrl;

    @Column(length = 100)
    private String workOrderReference;

    @Column(nullable = false)
    private Integer confirmationCount = 0;

    @Column(nullable = false)
    private Integer disputeCount = 0;

    @Column(nullable = false, updatable = false)
    private Instant proposedAt;

    private Instant verifiedAt;

    public ResolutionEvidence() {}

    @PrePersist
    protected void onCreate() {
        this.proposedAt = Instant.now();
        if (this.confirmationCount == null) this.confirmationCount = 0;
        if (this.disputeCount == null) this.disputeCount = 0;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getProposedBy() { return proposedBy; }
    public void setProposedBy(User proposedBy) { this.proposedBy = proposedBy; }
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
    public Integer getConfirmationCount() { return confirmationCount; }
    public void setConfirmationCount(Integer confirmationCount) { this.confirmationCount = confirmationCount; }
    public Integer getDisputeCount() { return disputeCount; }
    public void setDisputeCount(Integer disputeCount) { this.disputeCount = disputeCount; }
    public Instant getProposedAt() { return proposedAt; }
    public void setProposedAt(Instant proposedAt) { this.proposedAt = proposedAt; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
}
