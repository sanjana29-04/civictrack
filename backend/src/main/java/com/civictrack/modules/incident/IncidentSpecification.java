package com.civictrack.modules.incident;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.UUID;

public class IncidentSpecification {

    private IncidentSpecification() {}

    public static Specification<Incident> filter(
            IncidentCategory category,
            IncidentStatus status,
            IncidentPriority priority,
            String searchQuery,
            String assignedTeam,
            Instant startDate,
            Instant endDate,
            Boolean excludeMerged) {

        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (category != null) {
                predicates = cb.and(predicates, cb.equal(root.get("category"), category));
            }

            if (status != null) {
                predicates = cb.and(predicates, cb.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicates = cb.and(predicates, cb.equal(root.get("priority"), priority));
            }

            if (StringUtils.hasText(assignedTeam)) {
                predicates = cb.and(predicates, cb.equal(root.get("assignedTeam"), assignedTeam));
            }

            if (Boolean.TRUE.equals(excludeMerged)) {
                predicates = cb.and(predicates, cb.isNull(root.get("mergedIntoIncident")));
            }

            if (startDate != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("createdAt"), startDate));
            }

            if (endDate != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("createdAt"), endDate));
            }

            if (StringUtils.hasText(searchQuery)) {
                String pattern = "%" + searchQuery.trim().toLowerCase() + "%";
                var titleMatch = cb.like(cb.lower(root.get("title")), pattern);
                var descMatch = cb.like(cb.lower(root.get("description")), pattern);
                var numMatch = cb.like(cb.lower(root.get("incidentNumber")), pattern);
                var addrMatch = cb.like(cb.lower(root.get("address")), pattern);
                var landmarkMatch = cb.like(cb.lower(root.get("landmark")), pattern);
                predicates = cb.and(predicates, cb.or(titleMatch, descMatch, numMatch, addrMatch, landmarkMatch));
            }

            return predicates;
        };
    }
}
