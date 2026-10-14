package com.civictrack.modules.resolution;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResolutionReviewRepository extends JpaRepository<ResolutionReview, UUID> {
    List<ResolutionReview> findByResolutionEvidenceIdOrderByCreatedAtDesc(UUID evidenceId);
    List<ResolutionReview> findByIncidentIdOrderByCreatedAtDesc(UUID incidentId);
    boolean existsByResolutionEvidenceIdAndReviewerId(UUID evidenceId, UUID reviewerId);
    long countByReviewType(ReviewType reviewType);
}
