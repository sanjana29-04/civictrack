package com.civictrack.modules.timeline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimelineRepository extends JpaRepository<IncidentTimelineEvent, UUID> {
    List<IncidentTimelineEvent> findByIncidentIdOrderByCreatedAtAsc(UUID incidentId);
    List<IncidentTimelineEvent> findByIncidentIdAndIsPublicTrueOrderByCreatedAtAsc(UUID incidentId);
}
