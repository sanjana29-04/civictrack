package com.civictrack.modules.auth;

import com.civictrack.common.exceptions.ConflictException;
import com.civictrack.config.JwtTokenProvider;
import com.civictrack.config.UserPrincipal;
import com.civictrack.modules.auth.dto.AuthResponse;
import com.civictrack.modules.auth.dto.LoginRequest;
import com.civictrack.modules.auth.dto.RegisterRequest;
import com.civictrack.modules.user.Role;
import com.civictrack.modules.user.User;
import com.civictrack.modules.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("citizen@civictrack.org", "encodedPassword", "Priya Sharma", "+91 98765 43210", Role.ROLE_CITIZEN);
        sampleUser.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Registration succeeds and returns JWT with Citizen role")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("citizen@civictrack.org", "Password123!", "Priya Sharma", "+91 98765 43210", null);

        when(userRepository.existsByEmailIgnoreCase(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(any())).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals("citizen@civictrack.org", response.getUser().getEmail());
        assertEquals(Role.ROLE_CITIZEN, response.getUser().getRole());
    }

    @Test
    @DisplayName("Registration throws ConflictException when email is already registered")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("citizen@civictrack.org", "Password123!", "Priya Sharma", null, null);

        when(userRepository.existsByEmailIgnoreCase("citizen@civictrack.org")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login with valid credentials issues token")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("citizen@civictrack.org", "Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmailIgnoreCase("citizen@civictrack.org")).thenReturn(Optional.of(sampleUser));
        when(tokenProvider.generateToken(auth)).thenReturn("mocked.jwt.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
        assertEquals(sampleUser.getEmail(), response.getUser().getEmail());
    }
}
