package com.civictrack.modules.auth;

import com.civictrack.common.exceptions.ConflictException;
import com.civictrack.common.exceptions.ResourceNotFoundException;
import com.civictrack.config.JwtTokenProvider;
import com.civictrack.modules.auth.dto.AuthResponse;
import com.civictrack.modules.auth.dto.LoginRequest;
import com.civictrack.modules.auth.dto.RegisterRequest;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserDto;
import com.civictrack.modules.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ConflictException("An account with email " + request.getEmail() + " already exists");
        }

        Role userRole = (request.getRole() != null) ? request.getRole() : Role.ROLE_CITIZEN;

        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getPhone(),
                userRole
        );

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        return new AuthResponse(jwt, UserDto.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String jwt = tokenProvider.generateToken(authentication);
        return new AuthResponse(jwt, UserDto.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserDto.fromEntity(user);
    }
}
