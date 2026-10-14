package com.civictrack.modules.attachment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttachmentRepository extends JpaRepository<IncidentAttachment, UUID> {
    List<IncidentAttachment> findByIncidentIdOrderByCreatedAtDesc(UUID incidentId);
    List<IncidentAttachment> findByIncidentIdAndAttachmentType(UUID incidentId, AttachmentType type);
}
