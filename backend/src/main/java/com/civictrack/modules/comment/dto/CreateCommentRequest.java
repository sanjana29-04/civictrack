package com.civictrack.modules.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(message = "Comment text is required")
    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    private String commentText;

    private boolean isInternal = false;

    public CreateCommentRequest() {}

    public CreateCommentRequest(String commentText, boolean isInternal) {
        this.commentText = commentText;
        this.isInternal = isInternal;
    }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public boolean isInternal() { return isInternal; }
    public void setInternal(boolean internal) { isInternal = internal; }
}
