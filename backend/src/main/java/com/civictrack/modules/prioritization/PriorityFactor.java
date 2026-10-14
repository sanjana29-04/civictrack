package com.civictrack.modules.prioritization;

public class PriorityFactor {
    private String name;
    private int scoreImpact;
    private String description;
    private boolean triggered;

    public PriorityFactor() {}

    public PriorityFactor(String name, int scoreImpact, String description, boolean triggered) {
        this.name = name;
        this.scoreImpact = scoreImpact;
        this.description = description;
        this.triggered = triggered;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getScoreImpact() { return scoreImpact; }
    public void setScoreImpact(int scoreImpact) { this.scoreImpact = scoreImpact; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isTriggered() { return triggered; }
    public void setTriggered(boolean triggered) { this.triggered = triggered; }
}
