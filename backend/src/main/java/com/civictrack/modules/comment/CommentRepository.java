package com.civictrack.modules.comment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<IncidentComment, UUID> {
    List<IncidentComment> findByIncidentIdAndIsInternalFalseOrderByCreatedAtAsc(UUID incidentId);
    List<IncidentComment> findByIncidentIdOrderByCreatedAtAsc(UUID incidentId);
}
