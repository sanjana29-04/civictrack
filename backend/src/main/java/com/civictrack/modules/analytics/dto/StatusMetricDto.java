package com.civictrack.modules.analytics.dto;

public class StatusMetricDto {
    private String status;
    private String displayName;
    private long count;

    public StatusMetricDto() {}

    public StatusMetricDto(String status, String displayName, long count) {
        this.status = status;
        this.displayName = displayName;
        this.count = count;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}
