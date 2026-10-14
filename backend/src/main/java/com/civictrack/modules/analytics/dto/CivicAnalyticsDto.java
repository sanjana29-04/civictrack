package com.civictrack.modules.analytics.dto;

import java.util.List;
import java.util.Map;

public class CivicAnalyticsDto {
    private long totalIncidents;
    private long openIncidents;
    private long inProgressIncidents;
    private long awaitingVerificationCount;
    private long resolvedAndClosedCount;
    private long reopenedCount;
    private long duplicateMergedCount;
    private double resolutionConfirmationRatePercent;
    private double averageResolutionDays;

    private List<CategoryMetricDto> categoryDistribution;
    private List<StatusMetricDto> statusDistribution;
    private List<PriorityMetricDto> priorityDistribution;
    private List<HotspotAreaDto> recurringHotspots;

    public CivicAnalyticsDto() {}

    public long getTotalIncidents() { return totalIncidents; }
    public void setTotalIncidents(long totalIncidents) { this.totalIncidents = totalIncidents; }
    public long getOpenIncidents() { return openIncidents; }
    public void setOpenIncidents(long openIncidents) { this.openIncidents = openIncidents; }
    public long getInProgressIncidents() { return inProgressIncidents; }
    public void setInProgressIncidents(long inProgressIncidents) { this.inProgressIncidents = inProgressIncidents; }
    public long getAwaitingVerificationCount() { return awaitingVerificationCount; }
    public void setAwaitingVerificationCount(long awaitingVerificationCount) { this.awaitingVerificationCount = awaitingVerificationCount; }
    public long getResolvedAndClosedCount() { return resolvedAndClosedCount; }
    public void setResolvedAndClosedCount(long resolvedAndClosedCount) { this.resolvedAndClosedCount = resolvedAndClosedCount; }
    public long getReopenedCount() { return reopenedCount; }
    public void setReopenedCount(long reopenedCount) { this.reopenedCount = reopenedCount; }
    public long getDuplicateMergedCount() { return duplicateMergedCount; }
    public void setDuplicateMergedCount(long duplicateMergedCount) { this.duplicateMergedCount = duplicateMergedCount; }
    public double getResolutionConfirmationRatePercent() { return resolutionConfirmationRatePercent; }
    public void setResolutionConfirmationRatePercent(double resolutionConfirmationRatePercent) { this.resolutionConfirmationRatePercent = resolutionConfirmationRatePercent; }
    public double getAverageResolutionDays() { return averageResolutionDays; }
    public void setAverageResolutionDays(double averageResolutionDays) { this.averageResolutionDays = averageResolutionDays; }
    public List<CategoryMetricDto> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(List<CategoryMetricDto> categoryDistribution) { this.categoryDistribution = categoryDistribution; }
    public List<StatusMetricDto> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(List<StatusMetricDto> statusDistribution) { this.statusDistribution = statusDistribution; }
    public List<PriorityMetricDto> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(List<PriorityMetricDto> priorityDistribution) { this.priorityDistribution = priorityDistribution; }
    public List<HotspotAreaDto> getRecurringHotspots() { return recurringHotspots; }
    public void setRecurringHotspots(List<HotspotAreaDto> recurringHotspots) { this.recurringHotspots = recurringHotspots; }
}
