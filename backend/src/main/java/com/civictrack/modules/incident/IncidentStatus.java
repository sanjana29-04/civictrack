package com.civictrack.modules.incident;

import java.util.Collections;
import java.util.EnumSet;
import java.util.Set;

public enum IncidentStatus {
    SUBMITTED("Submitted"),
    UNDER_REVIEW("Under Review"),
    CONFIRMED("Confirmed"),
    ASSIGNED("Assigned"),
    IN_PROGRESS("In Progress"),
    RESOLUTION_PROPOSED("Resolution Proposed"),
    RESOLVED_AWAITING_VERIFICATION("Resolved — Awaiting Verification"),
    REOPENED("Reopened"),
    CLOSED("Closed"),
    REJECTED("Rejected");

    private final String displayName;

    IncidentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Checks if transitioning from this status to targetStatus is allowed.
     */
    public boolean canTransitionTo(IncidentStatus target) {
        if (this == target) return true;

        return switch (this) {
            case SUBMITTED -> EnumSet.of(UNDER_REVIEW, CONFIRMED, REJECTED).contains(target);
            case UNDER_REVIEW -> EnumSet.of(CONFIRMED, REJECTED, ASSIGNED).contains(target);
            case CONFIRMED -> EnumSet.of(ASSIGNED, IN_PROGRESS, REJECTED).contains(target);
            case ASSIGNED -> EnumSet.of(IN_PROGRESS, CONFIRMED).contains(target);
            case IN_PROGRESS -> EnumSet.of(RESOLUTION_PROPOSED, RESOLVED_AWAITING_VERIFICATION, ASSIGNED).contains(target);
            case RESOLUTION_PROPOSED -> EnumSet.of(RESOLVED_AWAITING_VERIFICATION, IN_PROGRESS, REOPENED).contains(target);
            case RESOLVED_AWAITING_VERIFICATION -> EnumSet.of(CLOSED, REOPENED, IN_PROGRESS).contains(target);
            case REOPENED -> EnumSet.of(UNDER_REVIEW, ASSIGNED, IN_PROGRESS).contains(target);
            case REJECTED -> EnumSet.of(UNDER_REVIEW).contains(target); // Can be appealed/re-reviewed
            case CLOSED -> EnumSet.of(REOPENED).contains(target); // Reopened if problem recurs
        };
    }
}
