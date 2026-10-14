package com.civictrack.modules.comment;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.comment.dto.CommentDto;
import com.civictrack.modules.comment.dto.CreateCommentRequest;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incidents/{incidentId}/comments")
@Tag(name = "Incident Comments", description = "Public discussion and internal staff notes endpoints")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, UserRepository userRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get comments for an incident (internal notes hidden from general public)")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(@PathVariable UUID incidentId) {
        boolean isPrivileged = SecurityUtils.hasRole(Role.ROLE_OPERATIONS) || SecurityUtils.hasRole(Role.ROLE_MODERATOR);
        List<CommentDto> comments = commentService.getComments(incidentId, isPrivileged);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @PostMapping
    @Operation(summary = "Post a comment or operational update")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable UUID incidentId,
            @Valid @RequestBody CreateCommentRequest request) {

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User author = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        CommentDto dto = commentService.addComment(incidentId, request, author);
        return ResponseEntity.ok(ApiResponse.success("Comment added", dto));
    }
}
