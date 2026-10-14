package com.civictrack.modules.duplicate;

import com.civictrack.common.HaversineDistance;
import com.civictrack.common.exceptions.BadRequestException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.duplicate.dto.DuplicateCandidateDto;
import com.civictrack.modules.duplicate.dto.MergeIncidentRequest;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.incident.IncidentStatus;
import com.civictrack.modules.support.IncidentSupport;
import com.civictrack.modules.support.SupportRepository;
import com.civictrack.modules.timeline.TimelineEventType;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DuplicateDetectionService {

    private static final Logger log = LoggerFactory.getLogger(DuplicateDetectionService.class);

    private static final double MAX_SEARCH_RADIUS_METERS = 500.0;
    private static final double MIN_CONFIDENCE_THRESHOLD = 0.50;

    private final IncidentRepository incidentRepository;
    private final DuplicateCandidateRepository candidateRepository;
    private final MergeEventRepository mergeEventRepository;
    private final SupportRepository supportRepository;
    private final TimelineService timelineService;

    public DuplicateDetectionService(IncidentRepository incidentRepository,
                                     DuplicateCandidateRepository candidateRepository,
                                     MergeEventRepository mergeEventRepository,
                                     SupportRepository supportRepository,
                                     TimelineService timelineService) {
        this.incidentRepository = incidentRepository;
        this.candidateRepository = candidateRepository;
        this.mergeEventRepository = mergeEventRepository;
        this.supportRepository = supportRepository;
        this.timelineService = timelineService;
    }

    /**
     * Searches for possible duplicates in real-time (e.g., during issue reporting form fill).
     */
    @Transactional(readOnly = true)
    public List<DuplicateCandidateDto> findPossibleDuplicatesRealtime(
            double latitude, double longitude, IncidentCategory category, String title, String description) {

        HaversineDistance.BoundingBox box = HaversineDistance.calculateBoundingBox(latitude, longitude, MAX_SEARCH_RADIUS_METERS);
        List<Incident> nearby = incidentRepository.findNearbyCandidates(
                box.getMinLat(), box.getMaxLat(), box.getMinLon(), box.getMaxLon());

        List<DuplicateCandidateDto> results = new ArrayList<>();

        for (Incident target : nearby) {
            double distance = HaversineDistance.calculateMeters(latitude, longitude, target.getLatitude(), target.getLongitude());
            if (distance > MAX_SEARCH_RADIUS_METERS) continue;

            boolean categoryMatch = (category != null && category.equals(target.getCategory()));
            double textSim = calculateTextSimilarity(title + " " + description, target.getTitle() + " " + target.getDescription());

            // Proximity score (1.0 at 0m, 0.0 at 500m)
            double geoScore = Math.max(0.0, 1.0 - (distance / MAX_SEARCH_RADIUS_METERS));
            double categoryScore = categoryMatch ? 1.0 : 0.2;
            double confidence = (0.45 * geoScore) + (0.35 * textSim) + (0.20 * categoryScore);

            if (confidence >= MIN_CONFIDENCE_THRESHOLD || (distance <= 150 && categoryMatch)) {
                DuplicateCandidate candidate = new DuplicateCandidate();
                candidate.setSourceIncident(null);
                candidate.setTargetIncident(target);
                candidate.setDistanceMeters(distance);
                candidate.setTextSimilarityScore(textSim);
                candidate.setCategoryMatch(categoryMatch);
                candidate.setOverallConfidenceScore(confidence);
                candidate.setMatchReason(buildExplanation(distance, categoryMatch, textSim));
                candidate.setStatus(CandidateStatus.PENDING_REVIEW);

                results.add(DuplicateCandidateDto.fromEntity(candidate, true));
            }
        }

        results.sort(Comparator.comparingDouble(DuplicateCandidateDto::getOverallConfidenceScore).reversed());
        return results;
    }

    /**
     * Evaluates and records duplicate candidates for a newly saved incident.
     */
    @Transactional
    public List<DuplicateCandidate> evaluateAndSaveCandidates(Incident newIncident) {
        HaversineDistance.BoundingBox box = HaversineDistance.calculateBoundingBox(
                newIncident.getLatitude(), newIncident.getLongitude(), MAX_SEARCH_RADIUS_METERS);

        List<Incident> nearby = incidentRepository.findNearbyCandidates(
                box.getMinLat(), box.getMaxLat(), box.getMinLon(), box.getMaxLon());

        List<DuplicateCandidate> createdCandidates = new ArrayList<>();

        for (Incident existing : nearby) {
            if (existing.getId().equals(newIncident.getId())) continue;

            double distance = HaversineDistance.calculateMeters(
                    newIncident.getLatitude(), newIncident.getLongitude(),
                    existing.getLatitude(), existing.getLongitude()
            );

            if (distance > MAX_SEARCH_RADIUS_METERS) continue;

            boolean categoryMatch = newIncident.getCategory().equals(existing.getCategory());
            double textSim = calculateTextSimilarity(
                    newIncident.getTitle() + " " + newIncident.getDescription(),
                    existing.getTitle() + " " + existing.getDescription()
            );

            double geoScore = Math.max(0.0, 1.0 - (distance / MAX_SEARCH_RADIUS_METERS));
            double categoryScore = categoryMatch ? 1.0 : 0.2;
            double confidence = (0.45 * geoScore) + (0.35 * textSim) + (0.20 * categoryScore);

            if (confidence >= MIN_CONFIDENCE_THRESHOLD || (distance <= 150 && categoryMatch)) {
                if (!candidateRepository.existsBySourceIncidentIdAndTargetIncidentId(newIncident.getId(), existing.getId())) {
                    DuplicateCandidate candidate = new DuplicateCandidate(
                            newIncident,
                            existing,
                            distance,
                            textSim,
                            categoryMatch,
                            confidence,
                            buildExplanation(distance, categoryMatch, textSim)
                    );
                    createdCandidates.add(candidateRepository.save(candidate));
                }
            }
        }

        return createdCandidates;
    }

    /**
     * Authorized moderator merges duplicate incident into surviving incident.
     */
    @Transactional
    public IncidentMergeEvent mergeIncidents(MergeIncidentRequest request, User moderator) {
        if (request.getSurvivingIncidentId().equals(request.getDuplicateIncidentId())) {
            throw new BadRequestException("An incident cannot be merged into itself");
        }

        Incident surviving = incidentRepository.findById(request.getSurvivingIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Surviving incident not found"));

        Incident duplicate = incidentRepository.findById(request.getDuplicateIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Duplicate incident not found"));

        if (duplicate.getMergedIntoIncident() != null) {
            throw new BadRequestException("This incident has already been merged into " +
                    duplicate.getMergedIntoIncident().getIncidentNumber());
        }

        if (surviving.getMergedIntoIncident() != null) {
            throw new BadRequestException("Cannot merge into an incident that has already been merged");
        }

        // Migrate support votes cleanly without creating duplicates
        List<IncidentSupport> duplicateSupports = supportRepository.findByIncidentId(duplicate.getId());
        int transferredVotes = 0;

        for (IncidentSupport sup : duplicateSupports) {
            if (!supportRepository.existsByIncidentIdAndUserId(surviving.getId(), sup.getUser().getId())) {
                IncidentSupport newSupport = new IncidentSupport(surviving, sup.getUser());
                supportRepository.save(newSupport);
                transferredVotes++;
            }
        }

        // Update counts
        surviving.setSupportCount(surviving.getSupportCount() + transferredVotes);
        surviving.setDuplicateCount(surviving.getDuplicateCount() + 1);
        incidentRepository.save(surviving);

        // Mark duplicate as merged
        duplicate.setMergedIntoIncident(surviving);
        duplicate.setStatus(IncidentStatus.CLOSED);
        incidentRepository.save(duplicate);

        // Record merge event
        IncidentMergeEvent mergeEvent = new IncidentMergeEvent(
                surviving,
                duplicate,
                moderator,
                request.getReason(),
                transferredVotes
        );
        IncidentMergeEvent savedEvent = mergeEventRepository.save(mergeEvent);

        // Update candidate status if present
        List<DuplicateCandidate> candidates = candidateRepository.findPendingDuplicatesForIncident(duplicate.getId());
        for (DuplicateCandidate c : candidates) {
            c.setStatus(CandidateStatus.CONFIRMED_DUPLICATE);
            c.setReviewedBy(moderator);
            c.setReviewedAt(java.time.Instant.now());
            candidateRepository.save(c);
        }

        // Timeline events
        timelineService.recordEvent(
                surviving,
                TimelineEventType.MERGED,
                moderator.getFullName(),
                moderator.getRole().name(),
                "Merged duplicate report " + duplicate.getIncidentNumber() + " into this incident. Transferred " +
                        transferredVotes + " community support endorsements. Reason: " + request.getReason(),
                null,
                true
        );

        timelineService.recordEvent(
                duplicate,
                TimelineEventType.MERGED,
                moderator.getFullName(),
                moderator.getRole().name(),
                "Report confirmed as duplicate and merged into primary incident " + surviving.getIncidentNumber() +
                        ". All further updates and verification tracked under " + surviving.getIncidentNumber() + ".",
                null,
                true
        );

        return savedEvent;
    }

    /**
     * Dismiss a suggested duplicate candidate.
     */
    @Transactional
    public void dismissCandidate(UUID candidateId, User moderator) {
        DuplicateCandidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Duplicate candidate not found"));
        candidate.setStatus(CandidateStatus.DISMISSED);
        candidate.setReviewedBy(moderator);
        candidate.setReviewedAt(java.time.Instant.now());
        candidateRepository.save(candidate);
    }

    private String buildExplanation(double distance, boolean categoryMatch, double textSim) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Located %.0f meters away. ", distance));
        if (categoryMatch) {
            sb.append("Both share the identical category. ");
        } else {
            sb.append("Different categories but within close geographic radius. ");
        }
        sb.append(String.format("Text similarity index: %.0f%%.", textSim * 100));
        return sb.toString();
    }

    private double calculateTextSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;

        Set<String> words1 = tokenize(s1);
        Set<String> words2 = tokenize(s2);

        if (words1.isEmpty() || words2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);

        return (double) intersection.size() / union.size();
    }

    private Set<String> tokenize(String input) {
        return Arrays.stream(input.toLowerCase().split("\\W+"))
                .filter(w -> w.length() > 2)
                .filter(w -> !STOP_WORDS.contains(w))
                .collect(Collectors.toSet());
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "a", "an", "is", "in", "it", "of", "to", "at", "on", "for", "with", "this", "that", "there", "are", "has", "have"
    );
}
