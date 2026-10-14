package com.civictrack.modules.comment.dto;

import com.civictrack.modules.comment.IncidentComment;
import java.time.Instant;
import java.util.UUID;

public class CommentDto {
    private UUID id;
    private String authorName;
    private String authorRole;
    private String commentText;
    private boolean isInternal;
    private Instant createdAt;

    public CommentDto() {}

    public static CommentDto fromEntity(IncidentComment entity) {
        CommentDto dto = new CommentDto();
        dto.setId(entity.getId());
        dto.setAuthorName(entity.getAuthor().getFullName());
        dto.setAuthorRole(entity.getAuthor().getRole().name());
        dto.setCommentText(entity.getCommentText());
        dto.setInternal(entity.isInternal());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public boolean isInternal() { return isInternal; }
    public void setInternal(boolean internal) { isInternal = internal; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
