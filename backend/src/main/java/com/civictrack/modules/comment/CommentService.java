package com.civictrack.modules.comment;

import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.modules.comment.dto.CommentDto;
import com.civictrack.modules.comment.dto.CreateCommentRequest;
import com.civictrack.modules.incident.Incident;
import com.civictrack.modules.incident.IncidentRepository;
import com.civictrack.modules.timeline.TimelineEventType;
import com.civictrack.modules.timeline.TimelineService;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final IncidentRepository incidentRepository;
    private final TimelineService timelineService;

    public CommentService(CommentRepository commentRepository,
                          IncidentRepository incidentRepository,
                          TimelineService timelineService) {
        this.commentRepository = commentRepository;
        this.incidentRepository = incidentRepository;
        this.timelineService = timelineService;
    }

    @Transactional
    public CommentDto addComment(UUID incidentId, CreateCommentRequest request, User author) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        // Only staff/moderator can mark comments as internal
        boolean isInternal = request.isInternal() && (author.getRole() == Role.ROLE_OPERATIONS || author.getRole() == Role.ROLE_MODERATOR);

        IncidentComment comment = new IncidentComment(incident, author, request.getCommentText(), isInternal);
        IncidentComment saved = commentRepository.save(comment);

        // Record public update in timeline if operations staff posts an update
        if (!isInternal && author.getRole() == Role.ROLE_OPERATIONS) {
            timelineService.recordEvent(
                    incident,
                    TimelineEventType.PUBLIC_UPDATE,
                    author.getFullName(),
                    author.getRole().name(),
                    request.getCommentText(),
                    null,
                    true
            );
        }

        return CommentDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getComments(UUID incidentId, boolean isPrivileged) {
        List<IncidentComment> comments;
        if (isPrivileged) {
            comments = commentRepository.findByIncidentIdOrderByCreatedAtAsc(incidentId);
        } else {
            comments = commentRepository.findByIncidentIdAndIsInternalFalseOrderByCreatedAtAsc(incidentId);
        }
        return comments.stream().map(CommentDto::fromEntity).toList();
    }
}
