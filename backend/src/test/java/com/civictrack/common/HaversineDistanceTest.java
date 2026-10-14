package com.civictrack.common;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class HaversineDistanceTest {

    @Test
    @DisplayName("Haversine formula correctly computes distance between two known geographic points")
    void testDistanceBetweenPoints() {
        // Points ~60 meters apart
        double lat1 = 12.9716;
        double lon1 = 77.5946;
        double lat2 = 12.9720;
        double lon2 = 77.5950;

        double distance = HaversineDistance.calculateMeters(lat1, lon1, lat2, lon2);
        assertTrue(distance > 50 && distance < 80, "Expected distance around 65m but got: " + distance);
    }

    @Test
    @DisplayName("Identical coordinates return 0 meters distance")
    void testZeroDistance() {
        double lat = 12.9716;
        double lon = 77.5946;

        double distance = HaversineDistance.calculateMeters(lat, lon, lat, lon);
        assertEquals(0.0, distance, 0.001);
    }

    @Test
    @DisplayName("Bounding box encompasses the search radius")
    void testBoundingBox() {
        double lat = 12.9716;
        double lon = 77.5946;
        double radiusMeters = 500.0;

        HaversineDistance.BoundingBox box = HaversineDistance.calculateBoundingBox(lat, lon, radiusMeters);

        assertTrue(box.getMinLat() < lat);
        assertTrue(box.getMaxLat() > lat);
        assertTrue(box.getMinLon() < lon);
        assertTrue(box.getMaxLon() > lon);
    }
}
