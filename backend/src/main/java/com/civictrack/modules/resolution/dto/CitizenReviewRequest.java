package com.civictrack.modules.resolution.dto;

import com.civictrack.modules.resolution.ReviewType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CitizenReviewRequest {

    @NotNull(message = "Resolution evidence ID is required")
    private UUID resolutionEvidenceId;

    @NotNull(message = "Review type is required (CONFIRMATION or DISPUTE)")
    private ReviewType reviewType;

    @NotBlank(message = "Review feedback or explanation comment is required")
    private String comment;

    // Optional evidence URL if citizen disputes (e.g., photo showing pothole is still there)
    private String evidenceUrl;

    public CitizenReviewRequest() {}

    public UUID getResolutionEvidenceId() { return resolutionEvidenceId; }
    public void setResolutionEvidenceId(UUID resolutionEvidenceId) { this.resolutionEvidenceId = resolutionEvidenceId; }
    public ReviewType getReviewType() { return reviewType; }
    public void setReviewType(ReviewType reviewType) { this.reviewType = reviewType; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getEvidenceUrl() { return evidenceUrl; }
    public void setEvidenceUrl(String evidenceUrl) { this.evidenceUrl = evidenceUrl; }
}
