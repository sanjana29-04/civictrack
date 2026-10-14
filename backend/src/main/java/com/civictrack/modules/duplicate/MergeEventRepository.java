package com.civictrack.modules.duplicate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MergeEventRepository extends JpaRepository<IncidentMergeEvent, UUID> {
    List<IncidentMergeEvent> findBySurvivingIncidentIdOrderByCreatedAtDesc(UUID survivingIncidentId);
    Optional<IncidentMergeEvent> findByDuplicateIncidentId(UUID duplicateIncidentId);
}
