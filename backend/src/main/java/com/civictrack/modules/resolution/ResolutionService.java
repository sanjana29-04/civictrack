package com.civictrack.modules.resolution;

import com.civictrack.common.exceptions.BadRequestException;
import com.civictrack.common.exceptions.ConflictException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.incident.IncidentStatus;
import com.civictrack.modules.notification.NotificationService;
import com.civictrack.modules.resolution.dto.CitizenReviewRequest;
import com.civictrack.modules.resolution.dto.ProposeResolutionRequest;
import com.civictrack.modules.resolution.dto.ResolutionEvidenceDto;
import com.civictrack.modules.timeline.TimelineEventType;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ResolutionService {

    private final ResolutionEvidenceRepository evidenceRepository;
    private final ResolutionReviewRepository reviewRepository;
    private final IncidentRepository incidentRepository;
    private final TimelineService timelineService;
    private final NotificationService notificationService;

    public ResolutionService(ResolutionEvidenceRepository evidenceRepository,
                             ResolutionReviewRepository reviewRepository,
                             IncidentRepository incidentRepository,
                             TimelineService timelineService,
                             NotificationService notificationService) {
        this.evidenceRepository = evidenceRepository;
        this.reviewRepository = reviewRepository;
        this.incidentRepository = incidentRepository;
        this.timelineService = timelineService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ResolutionEvidence proposeResolution(ProposeResolutionRequest request, User staffUser) {
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        if (incident.getMergedIntoIncident() != null) {
            throw new BadRequestException("Cannot propose resolution on a merged incident");
        }

        if (incident.getStatus() == IncidentStatus.CLOSED) {
            throw new BadRequestException("Incident is already closed");
        }

        ResolutionEvidence evidence = new ResolutionEvidence();
        evidence.setIncident(incident);
        evidence.setProposedBy(staffUser);
        evidence.setResolutionSummary(request.getResolutionSummary());
        evidence.setInternalNotes(request.getInternalNotes());
        evidence.setBeforePhotoUrl(request.getBeforePhotoUrl() != null ? request.getBeforePhotoUrl() : incident.getPrimaryPhotoUrl());
        evidence.setAfterPhotoUrl(request.getAfterPhotoUrl());
        evidence.setWorkOrderReference(request.getWorkOrderReference());

        ResolutionEvidence savedEvidence = evidenceRepository.save(evidence);

        // Update incident status to RESOLVED_AWAITING_VERIFICATION (not silently marking closed!)
        incident.setStatus(IncidentStatus.RESOLVED_AWAITING_VERIFICATION);
        incident.setResolvedAt(Instant.now());
        incidentRepository.save(incident);

        // Record timeline
        timelineService.recordEvent(
                incident,
                TimelineEventType.RESOLUTION_PROPOSED,
                staffUser.getFullName(),
                staffUser.getRole().name(),
                "Field team submitted resolution evidence: " + request.getResolutionSummary() +
                        (request.getWorkOrderReference() != null ? " (Work Order: " + request.getWorkOrderReference() + ")" : "") +
                        ". Incident status set to 'Resolved — Awaiting Verification' for community confirmation.",
                request.getAfterPhotoUrl(),
                true
        );

        // Notify original reporter
        notificationService.createNotification(
                incident.getReporter(),
                "Resolution Proposed: " + incident.getIncidentNumber(),
                "Operations staff proposed resolution for your report: '" + incident.getTitle() + "'. Please review and confirm or challenge.",
                incident.getId(),
                "RESOLUTION_PROPOSED"
        );

        return savedEvidence;
    }

    @Transactional
    public ResolutionReview submitCitizenReview(CitizenReviewRequest request, User citizen) {
        ResolutionEvidence evidence = evidenceRepository.findById(request.getResolutionEvidenceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resolution evidence not found"));

        if (reviewRepository.existsByResolutionEvidenceIdAndReviewerId(evidence.getId(), citizen.getId())) {
            throw new ConflictException("You have already submitted a review for this resolution");
        }

        Incident incident = evidence.getIncident();

        ResolutionReview review = new ResolutionReview(
                evidence,
                incident,
                citizen,
                request.getReviewType(),
                request.getComment(),
                request.getEvidenceUrl()
        );

        ResolutionReview savedReview = reviewRepository.save(review);

        if (request.getReviewType() == ReviewType.CONFIRMATION) {
            evidence.setConfirmationCount(evidence.getConfirmationCount() + 1);
            evidenceRepository.save(evidence);

            timelineService.recordEvent(
                    incident,
                    TimelineEventType.RESOLUTION_VERIFIED,
                    citizen.getFullName(),
                    "CITIZEN",
                    "Community member confirmed satisfactory resolution: \"" + request.getComment() + "\"",
                    null,
                    true
            );

            // If confirmed by original reporter or multiple citizens, can finalize to CLOSED
            if (incident.getReporter().getId().equals(citizen.getId()) || evidence.getConfirmationCount() >= 2) {
                incident.setStatus(IncidentStatus.CLOSED);
                incident.setClosedAt(Instant.now());
                incidentRepository.save(incident);
                evidence.setVerifiedAt(Instant.now());
                evidenceRepository.save(evidence);
            }

        } else if (request.getReviewType() == ReviewType.DISPUTE) {
            evidence.setDisputeCount(evidence.getDisputeCount() + 1);
            evidenceRepository.save(evidence);

            // Reopen incident for operational review
            incident.setStatus(IncidentStatus.REOPENED);
            incidentRepository.save(incident);

            timelineService.recordEvent(
                    incident,
                    TimelineEventType.RESOLUTION_DISPUTED,
                    citizen.getFullName(),
                    "CITIZEN",
                    "Resolution challenged by community member: \"" + request.getComment() + "\". Incident marked as Reopened for operations review.",
                    request.getEvidenceUrl(),
                    true
            );

            // Notify staff if assigned
            if (incident.getAssignedStaff() != null) {
                notificationService.createNotification(
                        incident.getAssignedStaff(),
                        "Resolution Challenged: " + incident.getIncidentNumber(),
                        "A citizen submitted follow-up evidence disputing resolution for: " + incident.getTitle(),
                        incident.getId(),
                        "RESOLUTION_DISPUTED"
                );
            }
        }

        return savedReview;
    }

    @Transactional(readOnly = true)
    public ResolutionEvidenceDto getLatestEvidenceForIncident(UUID incidentId) {
        return evidenceRepository.findFirstByIncidentIdOrderByProposedAtDesc(incidentId)
                .map(evidence -> {
                    List<ResolutionReview> reviews = reviewRepository.findByResolutionEvidenceIdOrderByCreatedAtDesc(evidence.getId());
                    return ResolutionEvidenceDto.fromEntity(evidence, reviews);
                })
                .orElse(null);
    }
}
