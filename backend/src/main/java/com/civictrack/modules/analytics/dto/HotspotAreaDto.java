package com.civictrack.modules.analytics.dto;

public class HotspotAreaDto {
    private String areaName;
    private double latitude;
    private double longitude;
    private long incidentCount;
    private String primaryCategory;

    public HotspotAreaDto() {}

    public HotspotAreaDto(String areaName, double latitude, double longitude, long incidentCount, String primaryCategory) {
        this.areaName = areaName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.incidentCount = incidentCount;
        this.primaryCategory = primaryCategory;
    }

    public String getAreaName() { return areaName; }
    public void setAreaName(String areaName) { this.areaName = areaName; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public long getIncidentCount() { return incidentCount; }
    public void setIncidentCount(long incidentCount) { this.incidentCount = incidentCount; }
    public String getPrimaryCategory() { return primaryCategory; }
    public void setPrimaryCategory(String primaryCategory) { this.primaryCategory = primaryCategory; }
}
