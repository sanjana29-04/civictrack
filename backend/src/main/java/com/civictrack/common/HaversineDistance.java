package com.civictrack.common;

/**
 * Calculates geographic distance using the Haversine formula.
 * Used as a reliable, environment-agnostic calculation for distance
 * and duplicate candidate proximity matching.
 */
public class HaversineDistance {

    private static final double EARTH_RADIUS_METERS = 6371000.0;

    private HaversineDistance() {}

    /**
     * Calculates the great-circle distance between two points in meters.
     */
    public static double calculateMeters(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double originLatRad = Math.toRadians(lat1);
        double destLatRad = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(originLatRad) * Math.cos(destLatRad);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c;
    }

    /**
     * Determines bounding box roughly covering a radius in meters around a point.
     * Useful for pre-filtering database queries using latitude and longitude indexes.
     */
    public static BoundingBox calculateBoundingBox(double lat, double lon, double radiusMeters) {
        double latDelta = (radiusMeters / EARTH_RADIUS_METERS) * (180.0 / Math.PI);
        double lonDelta = latDelta / Math.cos(Math.toRadians(lat));

        return new BoundingBox(
                lat - latDelta,
                lat + latDelta,
                lon - lonDelta,
                lon + lonDelta
        );
    }

    public static class BoundingBox {
        private final double minLat;
        private final double maxLat;
        private final double minLon;
        private final double maxLon;

        public BoundingBox(double minLat, double maxLat, double minLon, double maxLon) {
            this.minLat = minLat;
            this.maxLat = maxLat;
            this.minLon = minLon;
            this.maxLon = maxLon;
        }

        public double getMinLat() { return minLat; }
        public double getMaxLat() { return maxLat; }
        public double getMinLon() { return minLon; }
        public double getMaxLon() { return maxLon; }
    }
}
