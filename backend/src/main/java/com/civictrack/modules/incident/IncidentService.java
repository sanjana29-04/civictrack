package com.civictrack.modules.incident;

import com.civictrack.common.PageResponse;
import com.civictrack.common.exceptions.BadRequestException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.ai.AiClassificationService;
import com.civictrack.modules.ai.dto.AiAnalysisRequest;
import com.civictrack.modules.ai.dto.AiAnalysisResponse;
import com.civictrack.modules.attachment.AttachmentRepository;
import com.civictrack.modules.attachment.AttachmentType;
import com.civictrack.modules.attachment.IncidentAttachment;
import com.civictrack.modules.duplicate.DuplicateDetectionService;
import com.civictrack.modules.incident.dto.*;
import com.civictrack.modules.notification.NotificationService;
import com.civictrack.modules.prioritization.PriorityCalculationService;
import com.civictrack.modules.prioritization.PriorityExplanationDto;
import com.civictrack.modules.timeline.TimelineEventType;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class IncidentService {

    private static final Logger log = LoggerFactory.getLogger(IncidentService.class);

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final PriorityCalculationService priorityCalculationService;
    private final AiClassificationService aiClassificationService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final TimelineService timelineService;
    private final NotificationService notificationService;
    private final AttachmentRepository attachmentRepository;

    public IncidentService(IncidentRepository incidentRepository,
                           UserRepository userRepository,
                           PriorityCalculationService priorityCalculationService,
                           AiClassificationService aiClassificationService,
                           DuplicateDetectionService duplicateDetectionService,
                           TimelineService timelineService,
                           NotificationService notificationService,
                           AttachmentRepository attachmentRepository) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.priorityCalculationService = priorityCalculationService;
        this.aiClassificationService = aiClassificationService;
        this.duplicateDetectionService = duplicateDetectionService;
        this.timelineService = timelineService;
        this.notificationService = notificationService;
        this.attachmentRepository = attachmentRepository;
    }

    @Transactional
    public IncidentDto createIncident(CreateIncidentRequest request, User reporter) {
        Incident incident = new Incident();
        incident.setIncidentNumber(generateUniqueIncidentNumber());
        incident.setTitle(request.getTitle().trim());
        incident.setDescription(request.getDescription().trim());
        incident.setCategory(request.getCategory());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setAddress(request.getAddress());
        incident.setLandmark(request.getLandmark());
        incident.setIsApproximateLocation(Boolean.TRUE.equals(request.getIsApproximateLocation()));
        incident.setPrimaryPhotoUrl(request.getPrimaryPhotoUrl());
        incident.setReporter(reporter);
        incident.setStatus(IncidentStatus.SUBMITTED);

        // 1. Calculate Rule-Based Priority
        PriorityExplanationDto priorityResult = priorityCalculationService.calculatePriority(
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getPrimaryPhotoUrl() != null,
                0,
                Instant.now()
        );
        incident.setPriority(priorityResult.getCalculatedPriority());
        incident.setPriorityReason(priorityResult.getReadableExplanation());

        // 2. Perform AI-assisted Triage & Classification suggestions
        try {
            AiAnalysisRequest aiReq = new AiAnalysisRequest(
                    request.getTitle(),
                    request.getDescription(),
                    request.getCategory(),
                    request.getPrimaryPhotoUrl()
            );
            AiAnalysisResponse aiResp = aiClassificationService.analyze(aiReq);
            incident.setAiSuggestedCategory(aiResp.getSuggestedCategory());
            incident.setAiSuggestedPriority(aiResp.getSuggestedPriority());
            incident.setAiPriorityReason(aiResp.getPriorityReasoning());
            incident.setAiConfidence(aiResp.getConfidenceScore());
            incident.setAiSimulated(aiResp.isSimulated());
        } catch (Exception ex) {
            log.warn("AI analysis could not complete: {}. Proceeding with rule-based classification.", ex.getMessage());
            incident.setAiSimulated(true);
        }

        Incident savedIncident = incidentRepository.save(incident);

        // 3. Save primary attachment if provided
        if (request.getPrimaryPhotoUrl() != null && !request.getPrimaryPhotoUrl().isBlank()) {
            IncidentAttachment attachment = new IncidentAttachment();
            attachment.setIncident(savedIncident);
            attachment.setFileName(request.getPrimaryPhotoUrl().substring(request.getPrimaryPhotoUrl().lastIndexOf('/') + 1));
            attachment.setOriginalFileName("incident_photo.jpg");
            attachment.setContentType("image/jpeg");
            attachment.setFileSize(0L);
            attachment.setFileUrl(request.getPrimaryPhotoUrl());
            attachment.setAttachmentType(AttachmentType.INITIAL_REPORT);
            attachment.setUploadedBy(reporter);
            attachmentRepository.save(attachment);
        }

        // 4. Record initial timeline event
        timelineService.recordEvent(
                savedIncident,
                TimelineEventType.REPORT_SUBMITTED,
                reporter.getFullName(),
                "CITIZEN",
                "Incident report submitted for " + savedIncident.getCategory().getDisplayName() +
                        " with initial priority " + savedIncident.getPriority().name() + ".",
                savedIncident.getPrimaryPhotoUrl(),
                true
        );

        // 5. Evaluate and save possible duplicates in background
        duplicateDetectionService.evaluateAndSaveCandidates(savedIncident);

        // 6. Notify citizen
        notificationService.createNotification(
                reporter,
                "Report Submitted: " + savedIncident.getIncidentNumber(),
                "Your civic incident report has been received and registered. Tracking ID: " + savedIncident.getIncidentNumber(),
                savedIncident.getId(),
                "REPORT_SUBMITTED"
        );

        return IncidentDto.fromEntity(savedIncident);
    }

    @Transactional(readOnly = true)
    public IncidentDto getIncidentById(UUID id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
        return IncidentDto.fromEntity(incident);
    }

    @Transactional(readOnly = true)
    public IncidentDto getIncidentByNumber(String incidentNumber) {
        Incident incident = incidentRepository.findByIncidentNumber(incidentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with number: " + incidentNumber));
        return IncidentDto.fromEntity(incident);
    }

    @Transactional(readOnly = true)
    public PageResponse<IncidentDto> findIncidents(
            IncidentCategory category,
            IncidentStatus status,
            IncidentPriority priority,
            String searchQuery,
            String assignedTeam,
            Instant startDate,
            Instant endDate,
            Boolean excludeMerged,
            Pageable pageable) {

        Specification<Incident> spec = IncidentSpecification.filter(
                category, status, priority, searchQuery, assignedTeam, startDate, endDate, excludeMerged);

        Page<Incident> page = incidentRepository.findAll(spec, pageable);
        return new PageResponse<>(page.map(IncidentDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public PageResponse<IncidentDto> findMyReports(User reporter, Pageable pageable) {
        Page<Incident> page = incidentRepository.findByReporterAndMergedIntoIncidentIsNullOrderByCreatedAtDesc(reporter, pageable);
        return new PageResponse<>(page.map(IncidentDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public List<IncidentMapMarkerDto> getMapMarkers() {
        return incidentRepository.findAllPublicForMap().stream()
                .map(IncidentMapMarkerDto::fromEntity)
                .toList();
    }

    @Transactional
    public IncidentDto updateIncidentStatus(UUID incidentId, UpdateIncidentStatusRequest request, User modifier) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        if (incident.getMergedIntoIncident() != null) {
            throw new BadRequestException("Cannot update status of a merged report");
        }

        IncidentStatus currentStatus = incident.getStatus();
        IncidentStatus targetStatus = request.getStatus();

        // Enforce valid lifecycle transitions
        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new BadRequestException(String.format("Invalid status transition: Cannot change from %s to %s",
                    currentStatus.getDisplayName(), targetStatus.getDisplayName()));
        }

        incident.setStatus(targetStatus);

        if (request.getPriority() != null) {
            incident.setPriority(request.getPriority());
        }
        if (request.getCategory() != null) {
            incident.setCategory(request.getCategory());
        }
        if (request.getOfficialReferenceNumber() != null && !request.getOfficialReferenceNumber().isBlank()) {
            incident.setOfficialReferenceNumber(request.getOfficialReferenceNumber());
        }

        if (targetStatus == IncidentStatus.CLOSED) {
            incident.setClosedAt(Instant.now());
        }

        Incident saved = incidentRepository.save(incident);

        // Record timeline
        TimelineEventType eventType = switch (targetStatus) {
            case UNDER_REVIEW, CONFIRMED -> TimelineEventType.REVIEW_COMPLETED;
            case ASSIGNED -> TimelineEventType.ASSIGNED;
            case IN_PROGRESS -> TimelineEventType.WORK_STARTED;
            case RESOLUTION_PROPOSED -> TimelineEventType.RESOLUTION_PROPOSED;
            case RESOLVED_AWAITING_VERIFICATION -> TimelineEventType.RESOLUTION_PROPOSED;
            case REOPENED -> TimelineEventType.REOPENED;
            case REJECTED -> TimelineEventType.REJECTED;
            default -> TimelineEventType.PUBLIC_UPDATE;
        };

        timelineService.recordEvent(
                saved,
                eventType,
                modifier.getFullName(),
                modifier.getRole().name(),
                request.getReason(),
                null,
                true
        );

        // Notify reporter
        notificationService.createNotification(
                saved.getReporter(),
                "Status Updated: " + saved.getIncidentNumber(),
                "Incident status changed to '" + targetStatus.getDisplayName() + "'. Note: " + request.getReason(),
                saved.getId(),
                "STATUS_UPDATED"
        );

        return IncidentDto.fromEntity(saved);
    }

    @Transactional
    public IncidentDto assignIncident(UUID incidentId, AssignIncidentRequest request, User assigner) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        incident.setAssignedTeam(request.getAssignedTeam());

        User assignedStaff = null;
        if (request.getAssignedStaffId() != null) {
            assignedStaff = userRepository.findById(request.getAssignedStaffId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff member not found"));
            incident.setAssignedStaff(assignedStaff);
        }

        if (incident.getStatus() == IncidentStatus.SUBMITTED || incident.getStatus() == IncidentStatus.UNDER_REVIEW || incident.getStatus() == IncidentStatus.CONFIRMED) {
            incident.setStatus(IncidentStatus.ASSIGNED);
        }

        Incident saved = incidentRepository.save(incident);

        String details = "Assigned to team: " + request.getAssignedTeam() +
                (assignedStaff != null ? " (Staff: " + assignedStaff.getFullName() + ")" : "") +
                (request.getNotes() != null ? ". " + request.getNotes() : "");

        timelineService.recordEvent(
                saved,
                TimelineEventType.ASSIGNED,
                assigner.getFullName(),
                assigner.getRole().name(),
                details,
                null,
                true
        );

        if (assignedStaff != null) {
            notificationService.createNotification(
                    assignedStaff,
                    "Incident Assigned: " + saved.getIncidentNumber(),
                    "You have been assigned to incident: " + saved.getTitle(),
                    saved.getId(),
                    "INCIDENT_ASSIGNED"
            );
        }

        return IncidentDto.fromEntity(saved);
    }

    private String generateUniqueIncidentNumber() {
        int currentYear = Year.now().getValue();
        String candidate;
        do {
            int randomSeq = ThreadLocalRandom.current().nextInt(1000, 9999);
            candidate = String.format("CIV-%d-%04d", currentYear, randomSeq);
        } while (incidentRepository.existsByIncidentNumber(candidate));
        return candidate;
    }
}
