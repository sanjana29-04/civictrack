package com.civictrack.modules.comment;

import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incident_comments", indexes = {
    @Index(name = "idx_comment_incident", columnList = "incident_id"),
    @Index(name = "idx_comment_created_at", columnList = "createdAt")
})
public class IncidentComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @JsonIgnore
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String commentText;

    @Column(nullable = false)
    private boolean isInternal = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public IncidentComment() {}

    public IncidentComment(Incident incident, User author, String commentText, boolean isInternal) {
        this.incident = incident;
        this.author = author;
        this.commentText = commentText;
        this.isInternal = isInternal;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Incident getIncident() { return incident; }
    public void setIncident(Incident incident) { this.incident = incident; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public boolean isInternal() { return isInternal; }
    public void setInternal(boolean internal) { isInternal = internal; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
