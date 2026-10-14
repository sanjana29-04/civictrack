package com.civictrack.modules.notification;

import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.notification.dto.NotificationDto;
import com.civictrack.modules.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void createNotification(User recipient, String title, String message, UUID incidentId, String notificationType) {
        if (recipient == null) return;

        // Deduplication: prevent spamming duplicate notification types for same incident
        if (incidentId != null && notificationRepository.existsByRecipientIdAndIncidentIdAndNotificationType(
                recipient.getId(), incidentId, notificationType)) {
            return;
        }

        Notification notification = new Notification(recipient, title, message, incidentId, notificationType);
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public Page<NotificationDto> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (notification.getRecipient().getId().equals(userId)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsRead(userId);
    }
}
