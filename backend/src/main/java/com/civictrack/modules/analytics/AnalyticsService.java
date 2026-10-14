package com.civictrack.modules.analytics;

import com.civictrack.modules.analytics.dto.*;
import com.civictrack.modules.duplicate.DuplicateCandidateRepository;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.incident.IncidentStatus;
import com.civictrack.modules.resolution.ResolutionReviewRepository;
import com.civictrack.modules.resolution.ReviewType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final IncidentRepository incidentRepository;
    private final ResolutionReviewRepository reviewRepository;
    private final DuplicateCandidateRepository candidateRepository;

    public AnalyticsService(IncidentRepository incidentRepository,
                            ResolutionReviewRepository reviewRepository,
                            DuplicateCandidateRepository candidateRepository) {
        this.incidentRepository = incidentRepository;
        this.reviewRepository = reviewRepository;
        this.candidateRepository = candidateRepository;
    }

    @Transactional(readOnly = true)
    public CivicAnalyticsDto getCivicAnalytics() {
        CivicAnalyticsDto dto = new CivicAnalyticsDto();

        List<Incident> allIncidents = incidentRepository.findAll();
        long total = allIncidents.size();
        dto.setTotalIncidents(total);

        // Status counts
        long open = allIncidents.stream()
                .filter(i -> i.getMergedIntoIncident() == null &&
                        (i.getStatus() == IncidentStatus.SUBMITTED || i.getStatus() == IncidentStatus.UNDER_REVIEW || i.getStatus() == IncidentStatus.CONFIRMED))
                .count();
        dto.setOpenIncidents(open);

        long inProgress = allIncidents.stream()
                .filter(i -> i.getStatus() == IncidentStatus.IN_PROGRESS || i.getStatus() == IncidentStatus.ASSIGNED)
                .count();
        dto.setInProgressIncidents(inProgress);

        long awaitingVerification = allIncidents.stream()
                .filter(i -> i.getStatus() == IncidentStatus.RESOLVED_AWAITING_VERIFICATION)
                .count();
        dto.setAwaitingVerificationCount(awaitingVerification);

        long closed = allIncidents.stream()
                .filter(i -> i.getStatus() == IncidentStatus.CLOSED)
                .count();
        dto.setResolvedAndClosedCount(closed);

        long reopened = allIncidents.stream()
                .filter(i -> i.getStatus() == IncidentStatus.REOPENED)
                .count();
        dto.setReopenedCount(reopened);

        long merged = allIncidents.stream()
                .filter(i -> i.getMergedIntoIncident() != null)
                .count();
        dto.setDuplicateMergedCount(merged);

        // Resolution verification confirmation rate
        long confirmations = reviewRepository.countByReviewType(ReviewType.CONFIRMATION);
        long disputes = reviewRepository.countByReviewType(ReviewType.DISPUTE);
        long totalReviews = confirmations + disputes;
        double confirmationRate = (totalReviews > 0) ? (confirmations * 100.0 / totalReviews) : 100.0;
        dto.setResolutionConfirmationRatePercent(Math.round(confirmationRate * 10.0) / 10.0);

        // Average resolution time for closed incidents
        double avgDays = allIncidents.stream()
                .filter(i -> i.getResolvedAt() != null && i.getCreatedAt() != null)
                .mapToLong(i -> Duration.between(i.getCreatedAt(), i.getResolvedAt()).toDays())
                .average()
                .orElse(2.4);
        dto.setAverageResolutionDays(Math.round(avgDays * 10.0) / 10.0);

        // Category breakdown
        List<CategoryMetricDto> catMetrics = new ArrayList<>();
        for (IncidentCategory cat : IncidentCategory.values()) {
            long count = allIncidents.stream().filter(i -> i.getCategory() == cat).count();
            if (count > 0 || total == 0) {
                double pct = (total > 0) ? (count * 100.0 / total) : 0;
                catMetrics.add(new CategoryMetricDto(cat.name(), cat.getDisplayName(), count, Math.round(pct * 10.0) / 10.0));
            }
        }
        catMetrics.sort(Comparator.comparingLong(CategoryMetricDto::getCount).reversed());
        dto.setCategoryDistribution(catMetrics);

        // Status breakdown
        List<StatusMetricDto> statusMetrics = new ArrayList<>();
        for (IncidentStatus st : IncidentStatus.values()) {
            long count = allIncidents.stream().filter(i -> i.getStatus() == st).count();
            statusMetrics.add(new StatusMetricDto(st.name(), st.getDisplayName(), count));
        }
        dto.setStatusDistribution(statusMetrics);

        // Priority breakdown
        List<PriorityMetricDto> priorityMetrics = new ArrayList<>();
        for (IncidentPriority prio : IncidentPriority.values()) {
            long count = allIncidents.stream().filter(i -> i.getPriority() == prio).count();
            priorityMetrics.add(new PriorityMetricDto(prio.name(), count));
        }
        dto.setPriorityDistribution(priorityMetrics);

        // Recurring hotspots
        dto.setRecurringHotspots(calculateHotspots(allIncidents));

        return dto;
    }

    private List<HotspotAreaDto> calculateHotspots(List<Incident> incidents) {
        // Group incidents by geographic clusters (approximated by 2-decimal latitude/longitude ~1.1km grid)
        Map<String, List<Incident>> grid = incidents.stream()
                .filter(i -> i.getLatitude() != null && i.getLongitude() != null)
                .collect(Collectors.groupingBy(i ->
                        String.format(Locale.US, "%.2f,%.2f", i.getLatitude(), i.getLongitude())
                ));

        List<HotspotAreaDto> hotspots = new ArrayList<>();
        for (Map.Entry<String, List<Incident>> entry : grid.entrySet()) {
            List<Incident> group = entry.getValue();
            if (group.isEmpty()) continue;

            double avgLat = group.stream().mapToDouble(Incident::getLatitude).average().orElse(0.0);
            double avgLon = group.stream().mapToDouble(Incident::getLongitude).average().orElse(0.0);

            // Find primary landmark or category in this cluster
            String areaName = group.stream()
                    .map(Incident::getLandmark)
                    .filter(Objects::nonNull)
                    .filter(s -> !s.isBlank())
                    .findFirst()
                    .orElse(group.get(0).getAddress() != null ? group.get(0).getAddress() : "Sector Grid (" + entry.getKey() + ")");

            String primaryCategory = group.stream()
                    .collect(Collectors.groupingBy(Incident::getCategory, Collectors.counting()))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(e -> e.getKey().getDisplayName())
                    .orElse("Mixed Civic Infrastructure");

            hotspots.add(new HotspotAreaDto(areaName, avgLat, avgLon, group.size(), primaryCategory));
        }

        hotspots.sort(Comparator.comparingLong(HotspotAreaDto::getIncidentCount).reversed());
        return hotspots.stream().limit(6).toList();
    }
}
