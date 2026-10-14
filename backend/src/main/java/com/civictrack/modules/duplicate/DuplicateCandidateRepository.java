package com.civictrack.modules.duplicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DuplicateCandidateRepository extends JpaRepository<DuplicateCandidate, UUID> {

    List<DuplicateCandidate> findBySourceIncidentId(UUID sourceIncidentId);

    Page<DuplicateCandidate> findByStatusOrderByCreatedAtDesc(CandidateStatus status, Pageable pageable);

    @Query("SELECT dc FROM DuplicateCandidate dc WHERE " +
           "(dc.sourceIncident.id = :incidentId OR dc.targetIncident.id = :incidentId) " +
           "AND dc.status = 'PENDING_REVIEW' ORDER BY dc.overallConfidenceScore DESC")
    List<DuplicateCandidate> findPendingDuplicatesForIncident(@Param("incidentId") UUID incidentId);

    boolean existsBySourceIncidentIdAndTargetIncidentId(UUID sourceIncidentId, UUID targetIncidentId);

    long countByStatus(CandidateStatus status);
}
