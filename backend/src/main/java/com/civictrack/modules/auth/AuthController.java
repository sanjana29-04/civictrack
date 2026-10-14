package com.civictrack.modules.auth;

import com.civictrack.common.ApiResponse;
import com.civictrack.common.SecurityUtils;
import com.civictrack.modules.auth.dto.AuthResponse;
import com.civictrack.modules.auth.dto.LoginRequest;
import com.civictrack.modules.auth.dto.RegisterRequest;
import com.civictrack.modules.user.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User registration, login, and profile retrieval")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new citizen account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("Account created successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in with email and password to receive JWT")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get currently authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }
        UserDto userDto = authService.getCurrentUser(currentUserId);
        return ResponseEntity.ok(ApiResponse.success(userDto));
    }
}
