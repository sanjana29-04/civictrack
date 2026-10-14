package com.civictrack.modules.timeline;

import com.civictrack.modules.incident.Incident;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TimelineService {

    private final TimelineRepository timelineRepository;

    public TimelineService(TimelineRepository timelineRepository) {
        this.timelineRepository = timelineRepository;
    }

    @Transactional
    public IncidentTimelineEvent recordEvent(Incident incident, TimelineEventType eventType,
                                            String actorName, String actorRole,
                                            String details, String evidenceUrl, boolean isPublic) {
        IncidentTimelineEvent event = new IncidentTimelineEvent(
                incident,
                eventType,
                actorName != null ? actorName : "CivicTrack System",
                actorRole != null ? actorRole : "SYSTEM",
                details,
                evidenceUrl,
                isPublic
        );
        return timelineRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<IncidentTimelineEvent> getTimelineForIncident(UUID incidentId, boolean isPrivileged) {
        if (isPrivileged) {
            return timelineRepository.findByIncidentIdOrderByCreatedAtAsc(incidentId);
        } else {
            return timelineRepository.findByIncidentIdAndIsPublicTrueOrderByCreatedAtAsc(incidentId);
        }
    }
}
