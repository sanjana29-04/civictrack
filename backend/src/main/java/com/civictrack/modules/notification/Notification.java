package com.civictrack.modules.notification;

import com.civictrack.modules.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notif_recipient", columnList = "recipient_id"),
    @Index(name = "idx_notif_read", columnList = "isRead"),
    @Index(name = "idx_notif_created_at", columnList = "createdAt")
})
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    @JsonIgnore
    private User recipient;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    private UUID incidentId;

    @Column(nullable = false, length = 50)
    private String notificationType;

    @Column(nullable = false)
    private boolean isRead = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Notification() {}

    public Notification(User recipient, String title, String message, UUID incidentId, String notificationType) {
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.incidentId = incidentId;
        this.notificationType = notificationType;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.isRead = false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public UUID getIncidentId() { return incidentId; }
    public void setIncidentId(UUID incidentId) { this.incidentId = incidentId; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
