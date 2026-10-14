package com.civictrack.modules.support;

import com.civictrack.common.exceptions.BadRequestException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class SupportService {

    private final SupportRepository supportRepository;
    private final IncidentRepository incidentRepository;

    public SupportService(SupportRepository supportRepository, IncidentRepository incidentRepository) {
        this.supportRepository = supportRepository;
        this.incidentRepository = incidentRepository;
    }

    @Transactional
    public boolean toggleSupport(UUID incidentId, User user) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        if (incident.getMergedIntoIncident() != null) {
            throw new BadRequestException("This incident was merged into " +
                    incident.getMergedIntoIncident().getIncidentNumber() + ". Please support the active incident instead.");
        }

        Optional<IncidentSupport> existing = supportRepository.findByIncidentIdAndUserId(incidentId, user.getId());

        if (existing.isPresent()) {
            supportRepository.delete(existing.get());
            incident.setSupportCount(Math.max(0, incident.getSupportCount() - 1));
            incidentRepository.save(incident);
            return false; // Removed support
        } else {
            IncidentSupport support = new IncidentSupport(incident, user);
            supportRepository.save(support);
            incident.setSupportCount(incident.getSupportCount() + 1);
            incidentRepository.save(incident);
            return true; // Added support
        }
    }

    @Transactional(readOnly = true)
    public boolean hasUserSupported(UUID incidentId, UUID userId) {
        if (userId == null) return false;
        return supportRepository.existsByIncidentIdAndUserId(incidentId, userId);
    }
}
