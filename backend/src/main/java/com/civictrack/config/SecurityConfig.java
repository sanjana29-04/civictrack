package com.civictrack.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // For H2 console in dev
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setContentType("application/json");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"success\":false,\"error\":\"Unauthorized\",\"message\":\"Authentication is required to access this resource\"}");
                })
            )
            .authorizeHttpRequests(auth -> auth
                // Public authentication and documentation endpoints
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()

                // Public incident search, map markers, and details (viewing is public)
                .requestMatchers(HttpMethod.GET, "/incidents/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/incidents/map").permitAll()
                .requestMatchers(HttpMethod.GET, "/incidents/explore").permitAll()
                .requestMatchers(HttpMethod.GET, "/incidents/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/incidents/{id}/comments").permitAll()
                .requestMatchers(HttpMethod.GET, "/incidents/{id}/timeline").permitAll()
                .requestMatchers(HttpMethod.GET, "/analytics/public").permitAll()

                // Role-specific endpoints
                .requestMatchers("/moderator/**").hasAnyAuthority("ROLE_MODERATOR", "ROLE_OPERATIONS")
                .requestMatchers("/duplicates/merge", "/duplicates/dismiss/**", "/duplicates/candidates").hasAnyAuthority("ROLE_MODERATOR", "ROLE_OPERATIONS")
                .requestMatchers("/operations/**", "/assignments/**").hasAuthority("ROLE_OPERATIONS")
                .requestMatchers("/audit/**").hasAnyAuthority("ROLE_MODERATOR", "ROLE_OPERATIONS")

                // All other endpoints require authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
