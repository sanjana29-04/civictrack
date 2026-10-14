package com.civictrack.modules.duplicate;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "duplicate_candidates", indexes = {
    @Index(name = "idx_dup_source", columnList = "source_incident_id"),
    @Index(name = "idx_dup_target", columnList = "target_incident_id"),
    @Index(name = "idx_dup_status", columnList = "status")
})
public class DuplicateCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_incident_id", nullable = false)
    private Incident sourceIncident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_incident_id", nullable = false)
    private Incident targetIncident;

    @Column(nullable = false)
    private Double distanceMeters;

    @Column(nullable = false)
    private Double textSimilarityScore;

    @Column(nullable = false)
    private Boolean categoryMatch;

    @Column(nullable = false)
    private Double overallConfidenceScore;

    @Column(nullable = false, length = 500)
    private String matchReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CandidateStatus status = CandidateStatus.PENDING_REVIEW;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    private Instant reviewedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public DuplicateCandidate() {}

    public DuplicateCandidate(Incident sourceIncident, Incident targetIncident, Double distanceMeters,
                              Double textSimilarityScore, Boolean categoryMatch, Double overallConfidenceScore,
                              String matchReason) {
        this.sourceIncident = sourceIncident;
        this.targetIncident = targetIncident;
        this.distanceMeters = distanceMeters;
        this.textSimilarityScore = textSimilarityScore;
        this.categoryMatch = categoryMatch;
        this.overallConfidenceScore = overallConfidenceScore;
        this.matchReason = matchReason;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.status == null) this.status = CandidateStatus.PENDING_REVIEW;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getSourceIncident() { return sourceIncident; }
    public void setSourceIncident(Incident sourceIncident) { this.sourceIncident = sourceIncident; }
    public Incident getTargetIncident() { return targetIncident; }
    public void setTargetIncident(Incident targetIncident) { this.targetIncident = targetIncident; }
    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }
    public Double getTextSimilarityScore() { return textSimilarityScore; }
    public void setTextSimilarityScore(Double textSimilarityScore) { this.textSimilarityScore = textSimilarityScore; }
    public Boolean getCategoryMatch() { return categoryMatch; }
    public void setCategoryMatch(Boolean categoryMatch) { this.categoryMatch = categoryMatch; }
    public Double getOverallConfidenceScore() { return overallConfidenceScore; }
    public void setOverallConfidenceScore(Double overallConfidenceScore) { this.overallConfidenceScore = overallConfidenceScore; }
    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }
    public CandidateStatus getStatus() { return status; }
    public void setStatus(CandidateStatus status) { this.status = status; }
    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }
    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
