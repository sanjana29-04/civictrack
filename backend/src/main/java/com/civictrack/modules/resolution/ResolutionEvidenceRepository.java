package com.civictrack.modules.resolution;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResolutionEvidenceRepository extends JpaRepository<ResolutionEvidence, UUID> {
    Optional<ResolutionEvidence> findFirstByIncidentIdOrderByProposedAtDesc(UUID incidentId);
    List<ResolutionEvidence> findByIncidentIdOrderByProposedAtDesc(UUID incidentId);
}
