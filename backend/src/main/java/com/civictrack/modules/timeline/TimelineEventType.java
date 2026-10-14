package com.civictrack.modules.timeline;

public enum TimelineEventType {
    REPORT_SUBMITTED("Report Submitted", "Initial incident report submitted by citizen"),
    REVIEW_COMPLETED("Moderator Review", "Report reviewed and verified by civic moderator"),
    CATEGORY_PRIORITY_UPDATED("Classification Updated", "Category or priority adjusted based on triage assessment"),
    ASSIGNED("Assigned", "Incident dispatched to municipal operations team"),
    WORK_STARTED("Work In Progress", "Operational field team started on-site resolution work"),
    PUBLIC_UPDATE("Official Update", "Operational status update or milestone recorded"),
    RESOLUTION_PROPOSED("Resolution Proposed", "Operations team proposed completion with supporting evidence"),
    RESOLUTION_VERIFIED("Resolution Verified", "Community confirmed issue is satisfactorily resolved"),
    RESOLUTION_DISPUTED("Resolution Disputed", "Citizen challenged resolution with follow-up evidence"),
    REOPENED("Incident Reopened", "Incident reopened for additional remediation"),
    MERGED("Incident Merged", "Duplicate report merged into primary incident tracking record"),
    REJECTED("Report Rejected", "Report rejected with explanatory notice");

    private final String title;
    private final String description;

    TimelineEventType(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() { return title; }
    public String getDescription() { return description; }
}
