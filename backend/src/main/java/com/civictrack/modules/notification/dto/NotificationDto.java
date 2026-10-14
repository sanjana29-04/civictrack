package com.civictrack.modules.notification.dto;

import com.civictrack.modules.notification.Notification;
import java.time.Instant;
import java.util.UUID;

public class NotificationDto {
    private UUID id;
    private String title;
    private String message;
    private UUID incidentId;
    private String notificationType;
    private boolean isRead;
    private Instant createdAt;

    public NotificationDto() {}

    public static NotificationDto fromEntity(Notification entity) {
        NotificationDto dto = new NotificationDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setIncidentId(entity.getIncidentId());
        dto.setNotificationType(entity.getNotificationType());
        dto.setRead(entity.isRead());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
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
