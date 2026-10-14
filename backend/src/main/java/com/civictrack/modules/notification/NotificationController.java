package com.civictrack.modules.notification;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.PageResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.notification.dto.NotificationDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications", description = "In-app notifications and preferences endpoints")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @Operation(summary = "Get current user notifications")
    public ResponseEntity<ApiResponse<PageResponse<NotificationDto>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        Page<NotificationDto> notifications = notificationService.getUserNotifications(currentUserId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(new PageResponse<>(notifications)));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        long count = notificationService.getUnreadCount(currentUserId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        notificationService.markAsRead(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    @PutMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications for current user as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        notificationService.markAllAsRead(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }
}
