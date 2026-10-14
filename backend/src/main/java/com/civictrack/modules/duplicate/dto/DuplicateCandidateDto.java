package com.civictrack.modules.duplicate.dto;

import com.civictrack.modules.duplicate.CandidateStatus;
import com.civictrack.modules.duplicate.DuplicateCandidate;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentStatus;

import java.time.Instant;
import java.util.UUID;

public class DuplicateCandidateDto {
    private UUID id;
    private UUID candidateIncidentId;
    private String candidateIncidentNumber;
    private String candidateTitle;
    private String candidateDescription;
    private IncidentCategory candidateCategory;
    private IncidentStatus candidateStatus;
    private Double candidateLatitude;
    private Double candidateLongitude;
    private String candidatePhotoUrl;
    private Integer candidateSupportCount;
    private Instant candidateCreatedAt;

    private Double distanceMeters;
    private Double textSimilarityScore;
    private Boolean categoryMatch;
    private Double overallConfidenceScore;
    private String matchReason;
    private CandidateStatus status;

    public DuplicateCandidateDto() {}

    public static DuplicateCandidateDto fromEntity(DuplicateCandidate entity, boolean forSource) {
        DuplicateCandidateDto dto = new DuplicateCandidateDto();
        dto.setId(entity.getId());
        dto.setDistanceMeters(Math.round(entity.getDistanceMeters() * 10.0) / 10.0);
        dto.setTextSimilarityScore(Math.round(entity.getTextSimilarityScore() * 100.0) / 100.0);
        dto.setCategoryMatch(entity.getCategoryMatch());
        dto.setOverallConfidenceScore(Math.round(entity.getOverallConfidenceScore() * 100.0) / 100.0);
        dto.setMatchReason(entity.getMatchReason());
        dto.setStatus(entity.getStatus());

        Incident target = forSource ? entity.getTargetIncident() : entity.getSourceIncident();
        dto.setCandidateIncidentId(target.getId());
        dto.setCandidateIncidentNumber(target.getIncidentNumber());
        dto.setCandidateTitle(target.getTitle());
        dto.setCandidateDescription(target.getDescription());
        dto.setCandidateCategory(target.getCategory());
        dto.setCandidateStatus(target.getStatus());
        dto.setCandidateLatitude(target.getLatitude());
        dto.setCandidateLongitude(target.getLongitude());
        dto.setCandidatePhotoUrl(target.getPrimaryPhotoUrl());
        dto.setCandidateSupportCount(target.getSupportCount());
        dto.setCandidateCreatedAt(target.getCreatedAt());

        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getCandidateIncidentId() { return candidateIncidentId; }
    public void setCandidateIncidentId(UUID candidateIncidentId) { this.candidateIncidentId = candidateIncidentId; }
    public String getCandidateIncidentNumber() { return candidateIncidentNumber; }
    public void setCandidateIncidentNumber(String candidateIncidentNumber) { this.candidateIncidentNumber = candidateIncidentNumber; }
    public String getCandidateTitle() { return candidateTitle; }
    public void setCandidateTitle(String candidateTitle) { this.candidateTitle = candidateTitle; }
    public String getCandidateDescription() { return candidateDescription; }
    public void setCandidateDescription(String candidateDescription) { this.candidateDescription = candidateDescription; }
    public IncidentCategory getCandidateCategory() { return candidateCategory; }
    public void setCandidateCategory(IncidentCategory candidateCategory) { this.candidateCategory = candidateCategory; }
    public IncidentStatus getCandidateStatus() { return candidateStatus; }
    public void setCandidateStatus(IncidentStatus candidateStatus) { this.candidateStatus = candidateStatus; }
    public Double getCandidateLatitude() { return candidateLatitude; }
    public void setCandidateLatitude(Double candidateLatitude) { this.candidateLatitude = candidateLatitude; }
    public Double getCandidateLongitude() { return candidateLongitude; }
    public void setCandidateLongitude(Double candidateLongitude) { this.candidateLongitude = candidateLongitude; }
    public String getCandidatePhotoUrl() { return candidatePhotoUrl; }
    public void setCandidatePhotoUrl(String candidatePhotoUrl) { this.candidatePhotoUrl = candidatePhotoUrl; }
    public Integer getCandidateSupportCount() { return candidateSupportCount; }
    public void setCandidateSupportCount(Integer candidateSupportCount) { this.candidateSupportCount = candidateSupportCount; }
    public Instant getCandidateCreatedAt() { return candidateCreatedAt; }
    public void setCandidateCreatedAt(Instant candidateCreatedAt) { this.candidateCreatedAt = candidateCreatedAt; }
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
}
