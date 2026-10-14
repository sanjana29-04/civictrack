package com.civictrack.modules.incident;

public enum IncidentPriority {
    LOW(1, "Low", "Minor cosmetic or non-hazardous issue"),
    MEDIUM(2, "Medium", "Moderate inconvenience or localized disruption"),
    HIGH(3, "High", "Significant disruption, potential safety risk"),
    CRITICAL(4, "Critical", "Immediate safety hazard or severe infrastructure failure");

    private final int level;
    private final String displayName;
    private final String description;

    IncidentPriority(int level, String displayName, String description) {
        this.level = level;
        this.displayName = displayName;
        this.description = description;
    }

    public int getLevel() { return level; }
    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
}
