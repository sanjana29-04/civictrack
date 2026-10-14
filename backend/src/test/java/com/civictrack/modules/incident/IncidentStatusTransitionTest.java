package com.civictrack.modules.incident;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IncidentStatusTransitionTest {

    @Test
    @DisplayName("Permitted state transitions succeed according to the defined lifecycle")
    void testValidTransitions() {
        // Initial report submission transitions
        assertTrue(IncidentStatus.SUBMITTED.canTransitionTo(IncidentStatus.UNDER_REVIEW));
        assertTrue(IncidentStatus.SUBMITTED.canTransitionTo(IncidentStatus.CONFIRMED));
        assertTrue(IncidentStatus.SUBMITTED.canTransitionTo(IncidentStatus.REJECTED));

        // In progress to resolution proposed
        assertTrue(IncidentStatus.IN_PROGRESS.canTransitionTo(IncidentStatus.RESOLUTION_PROPOSED));
        assertTrue(IncidentStatus.IN_PROGRESS.canTransitionTo(IncidentStatus.RESOLVED_AWAITING_VERIFICATION));

        // Resolution proposed to verified or reopened
        assertTrue(IncidentStatus.RESOLVED_AWAITING_VERIFICATION.canTransitionTo(IncidentStatus.CLOSED));
        assertTrue(IncidentStatus.RESOLVED_AWAITING_VERIFICATION.canTransitionTo(IncidentStatus.REOPENED));

        // Reopened back to in progress
        assertTrue(IncidentStatus.REOPENED.canTransitionTo(IncidentStatus.IN_PROGRESS));
    }

    @Test
    @DisplayName("Illegal state transitions are prevented by the state machine")
    void testInvalidTransitions() {
        // Cannot bypass review/assignment and jump straight from SUBMITTED to CLOSED
        assertFalse(IncidentStatus.SUBMITTED.canTransitionTo(IncidentStatus.CLOSED));

        // Cannot jump directly from SUBMITTED to RESOLUTION_PROPOSED
        assertFalse(IncidentStatus.SUBMITTED.canTransitionTo(IncidentStatus.RESOLUTION_PROPOSED));

        // Cannot close an incident while still in ASSIGNED stage without resolution
        assertFalse(IncidentStatus.ASSIGNED.canTransitionTo(IncidentStatus.CLOSED));
    }
}
