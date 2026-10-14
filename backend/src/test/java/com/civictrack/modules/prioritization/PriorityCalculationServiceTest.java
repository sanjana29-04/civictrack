package com.civictrack.modules.prioritization;

import com.civictrack.modules.incident.IncidentCategory;
import com.civictrack.modules.incident.IncidentPriority;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class PriorityCalculationServiceTest {

    private PriorityCalculationService priorityService;

    @BeforeEach
    void setUp() {
        priorityService = new PriorityCalculationService();
    }

    @Test
    @DisplayName("Pothole on main road with safety keywords and photo computes High or Critical priority")
    void testHazardousPotholePriority() {
        String title = "Severe dangerous pothole crater on main road";
        String description = "Deep asphalt depression causing accident risk for two-wheelers and pedestrians near hospital.";

        PriorityExplanationDto result = priorityService.calculatePriority(
                title, description, IncidentCategory.ROADS_POTHOLES, true, 5, Instant.now());

        assertNotNull(result);
        assertTrue(result.getCalculatedPriority() == IncidentPriority.HIGH || result.getCalculatedPriority() == IncidentPriority.CRITICAL);
        assertTrue(result.getTotalScore() >= 50);
        assertNotNull(result.getReadableExplanation());
        assertFalse(result.getFactors().isEmpty());
    }

    @Test
    @DisplayName("Minor cosmetic report without hazards computes Low priority")
    void testMinorCosmeticPriority() {
        String title = "Faded paint on street divider";
        String description = "The paint on the median curb is slightly weathered.";

        PriorityExplanationDto result = priorityService.calculatePriority(
                title, description, IncidentCategory.OTHER, false, 0, Instant.now());

        assertNotNull(result);
        assertEquals(IncidentPriority.LOW, result.getCalculatedPriority());
        assertTrue(result.getTotalScore() < 30);
    }
}
