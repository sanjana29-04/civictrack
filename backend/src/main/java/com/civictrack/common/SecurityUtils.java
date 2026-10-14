package com.civictrack.common;

import com.civictrack.config.UserPrincipal;
import com.civictrack.modules.user.Role;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {

    private SecurityUtils() {}

    public static Optional<UserPrincipal> getCurrentUserPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return Optional.of(principal);
        }
        return Optional.empty();
    }

    public static UUID getCurrentUserId() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getId)
                .orElse(null);
    }

    public static String getCurrentUserEmail() {
        return getCurrentUserPrincipal()
                .map(UserPrincipal::getUsername)
                .orElse("anonymous");
    }

    public static boolean hasRole(Role role) {
        return getCurrentUserPrincipal()
                .map(principal -> principal.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals(role.name())))
                .orElse(false);
    }
}
