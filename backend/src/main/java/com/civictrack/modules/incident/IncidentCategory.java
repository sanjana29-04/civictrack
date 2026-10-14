package com.civictrack.modules.incident;

public enum IncidentCategory {
    ROADS_POTHOLES("Roads & Potholes", "Potholes, damaged asphalt, craters, or road cave-ins"),
    GARBAGE_SANITATION("Garbage & Sanitation", "Overflowing bins, uncollected waste, illegal dumping"),
    STREETLIGHTS("Streetlights", "Broken, flickering, non-operational, or hanging streetlamps"),
    DRAINAGE_WATERLOGGING("Drainage & Waterlogging", "Blocked drains, storm runoff overflow, stagnant standing water"),
    WATER_SUPPLY_LEAKAGE("Water Supply & Leakage", "Burst mains, leaking pipes, contamination, low pressure"),
    FOOTPATHS_ACCESSIBILITY("Footpaths & Accessibility", "Broken sidewalks, missing ramps, obstruction on pedestrian walkways"),
    PUBLIC_PROPERTY_DAMAGE("Public Property Damage", "Vandalized bus shelters, broken public railings, damaged park amenities"),
    OTHER("Other Civic Issues", "General community infrastructure maintenance problems");

    private final String displayName;
    private final String description;

    IncidentCategory(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
}
