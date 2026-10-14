package com.civictrack.modules.audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private final AuditRepository auditRepository;

    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    @Transactional
    public void record(String entityName, String entityId, String action, String performedBy, String userRole, String details) {
        AuditEvent event = new AuditEvent(entityName, entityId, action, performedBy, userRole, details);
        auditRepository.save(event);
    }

    @Transactional(readOnly = true)
    public Page<AuditEvent> getAuditLogs(Pageable pageable) {
        return auditRepository.findAllByOrderByTimestampDesc(pageable);
    }
}
