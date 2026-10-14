package com.civictrack.modules.user;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.PageResponse;
import com.civictrack.common.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@Tag(name = "User Management", description = "User profile and role management endpoints")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_MODERATOR', 'ROLE_OPERATIONS')")
    @Operation(summary = "List users for administration and assignments")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Page<UserDto> users = userRepository.findAll(PageRequest.of(page, size)).map(UserDto::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(new PageResponse<>(users)));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile information")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@RequestBody UserProfileUpdateDto dto) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone().trim());
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", UserDto.fromEntity(updated)));
    }

    public static class UserProfileUpdateDto {
        private String fullName;
        private String phone;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
    }
}
