package com.civictrack.modules.resolution.dto;

import com.civictrack.modules.resolution.ResolutionEvidence;
import com.civictrack.modules.resolution.ResolutionReview;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ResolutionEvidenceDto {
    private UUID id;
    private UUID incidentId;
    private String proposedByName;
    private String resolutionSummary;
    private String beforePhotoUrl;
    private String afterPhotoUrl;
    private String workOrderReference;
    private Integer confirmationCount;
    private Integer disputeCount;
    private Instant proposedAt;
    private Instant verifiedAt;
    private List<ReviewItemDto> reviews;

    public ResolutionEvidenceDto() {}

    public static ResolutionEvidenceDto fromEntity(ResolutionEvidence entity, List<ResolutionReview> reviews) {
        ResolutionEvidenceDto dto = new ResolutionEvidenceDto();
        dto.setId(entity.getId());
        dto.setIncidentId(entity.getIncident().getId());
        dto.setProposedByName(entity.getProposedBy().getFullName());
        dto.setResolutionSummary(entity.getResolutionSummary());
        dto.setBeforePhotoUrl(entity.getBeforePhotoUrl());
        dto.setAfterPhotoUrl(entity.getAfterPhotoUrl());
        dto.setWorkOrderReference(entity.getWorkOrderReference());
        dto.setConfirmationCount(entity.getConfirmationCount());
        dto.setDisputeCount(entity.getDisputeCount());
        dto.setProposedAt(entity.getProposedAt());
        dto.setVerifiedAt(entity.getVerifiedAt());

        if (reviews != null) {
            dto.setReviews(reviews.stream().map(r -> new ReviewItemDto(
                    r.getId(),
                    r.getReviewer().getFullName(),
                    r.getReviewType().name(),
                    r.getComment(),
                    r.getEvidenceUrl(),
                    r.getCreatedAt()
            )).toList());
        }

        return dto;
    }

    public static class ReviewItemDto {
        private UUID id;
        private String reviewerName;
        private String reviewType;
        private String comment;
        private String evidenceUrl;
        private Instant createdAt;

        public ReviewItemDto(UUID id, String reviewerName, String reviewType, String comment, String evidenceUrl, Instant createdAt) {
            this.id = id;
            this.reviewerName = reviewerName;
            this.reviewType = reviewType;
            this.comment = comment;
            this.evidenceUrl = evidenceUrl;
            this.createdAt = createdAt;
        }

        public UUID getId() { return id; }
        public String getReviewerName() { return reviewerName; }
        public String getReviewType() { return reviewType; }
        public String getComment() { return comment; }
        public String getEvidenceUrl() { return evidenceUrl; }
        public Instant getCreatedAt() { return createdAt; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getIncidentId() { return incidentId; }
    public void setIncidentId(UUID incidentId) { this.incidentId = incidentId; }
    public String getProposedByName() { return proposedByName; }
    public void setProposedByName(String proposedByName) { this.proposedByName = proposedByName; }
    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }
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
    public List<ReviewItemDto> getReviews() { return reviews; }
    public void setReviews(List<ReviewItemDto> reviews) { this.reviews = reviews; }
}
