package com.civictrack.modules.ai.dto;

import com.civictrack.modules.incident.IncidentCategory;
import jakarta.validation.constraints.NotBlank;

public class AiAnalysisRequest {

    @NotBlank(message = "Title is required for AI triage")
    private String title;

    @NotBlank(message = "Description is required for AI triage")
    private String description;

    private IncidentCategory userSelectedCategory;

    private String photoUrl;

    public AiAnalysisRequest() {}

    public AiAnalysisRequest(String title, String description, IncidentCategory userSelectedCategory, String photoUrl) {
        this.title = title;
        this.description = description;
        this.userSelectedCategory = userSelectedCategory;
        this.photoUrl = photoUrl;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public IncidentCategory getUserSelectedCategory() { return userSelectedCategory; }
    public void setUserSelectedCategory(IncidentCategory userSelectedCategory) { this.userSelectedCategory = userSelectedCategory; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
