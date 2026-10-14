package com.civictrack.modules.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SupportRepository extends JpaRepository<IncidentSupport, UUID> {
    boolean existsByIncidentIdAndUserId(UUID incidentId, UUID userId);
    Optional<IncidentSupport> findByIncidentIdAndUserId(UUID incidentId, UUID userId);
    List<IncidentSupport> findByIncidentId(UUID incidentId);
    Page<IncidentSupport> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    long countByIncidentId(UUID incidentId);
}
