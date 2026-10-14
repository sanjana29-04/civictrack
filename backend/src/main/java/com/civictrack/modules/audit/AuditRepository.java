package com.civictrack.modules.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditRepository extends JpaRepository<AuditEvent, UUID> {
    Page<AuditEvent> findAllByOrderByTimestampDesc(Pageable pageable);
    Page<AuditEvent> findByEntityNameOrderByTimestampDesc(String entityName, Pageable pageable);
}
