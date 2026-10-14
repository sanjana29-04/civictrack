package com.civictrack.modules.resolution;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resolution_reviews",
       uniqueConstraints = @UniqueConstraint(name = "uk_resolution_user_review", columnNames = {"resolution_evidence_id", "reviewer_id"}),
       indexes = {
           @Index(name = "idx_review_evidence", columnList = "resolution_evidence_id"),
           @Index(name = "idx_review_incident", columnList = "incident_id")
       })
public class ResolutionReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolution_evidence_id", nullable = false)
    @JsonIgnore
    private ResolutionEvidence resolutionEvidence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReviewType reviewType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(length = 500)
    private String evidenceUrl;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public ResolutionReview() {}

    public ResolutionReview(ResolutionEvidence resolutionEvidence, Incident incident, User reviewer,
                            ReviewType reviewType, String comment, String evidenceUrl) {
        this.resolutionEvidence = resolutionEvidence;
        this.incident = incident;
        this.reviewer = reviewer;
        this.reviewType = reviewType;
        this.comment = comment;
        this.evidenceUrl = evidenceUrl;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ResolutionEvidence getResolutionEvidence() { return resolutionEvidence; }
    public void setResolutionEvidence(ResolutionEvidence resolutionEvidence) { this.resolutionEvidence = resolutionEvidence; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }
    public ReviewType getReviewType() { return reviewType; }
    public void setReviewType(ReviewType reviewType) { this.reviewType = reviewType; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getEvidenceUrl() { return evidenceUrl; }
    public void setEvidenceUrl(String evidenceUrl) { this.evidenceUrl = evidenceUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
