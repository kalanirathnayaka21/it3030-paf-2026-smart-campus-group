package com.pafproject.backend.controller;

import com.pafproject.backend.dto.AuthResponse;
import com.pafproject.backend.dto.GoogleAuthRequest;
import com.pafproject.backend.dto.UserResponse;
import com.pafproject.backend.model.AppUser;
import com.pafproject.backend.service.AppUserService;
import com.pafproject.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * POST /api/auth/google
 *
 * Accepts a Google id_token from the frontend, verifies it via Google's tokeninfo
 * endpoint, upserts the user in the DB, and returns our own signed JWT.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService userService;
    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    private static final String GOOGLE_TOKENINFO_URL =
            "https://oauth2.googleapis.com/tokeninfo?id_token=";

    /**
     * Verifies the Google id_token and returns a campus JWT.
     *
     * @param request body containing the Google id_token string
     * @return AuthResponse with our JWT + user profile
     */
    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        try {
            // 1. Verify id_token with Google
            String url = GOOGLE_TOKENINFO_URL + request.getIdToken();
            @SuppressWarnings("unchecked")
            Map<String, Object> googlePayload = restTemplate.getForObject(url, Map.class);

            if (googlePayload == null || googlePayload.containsKey("error")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid Google token"));
            }

            String email   = (String) googlePayload.get("email");
            String name    = (String) googlePayload.getOrDefault("name", email);
            String picture = (String) googlePayload.getOrDefault("picture", "");

            // 2. Upsert user in our DB
            AppUser user = userService.findOrCreateUser(email, name, picture);

            // 3. Issue our own JWT
            String token = jwtService.generateToken(user);

            UserResponse userResponse = UserResponse.builder()
                    .id(user.getId().toString())
                    .email(user.getEmail())
                    .name(user.getName())
                    .picture(user.getPicture())
                    .role(user.getRole().name())
                    .build();

            log.info("Authenticated user: {} with role: {}", email, user.getRole());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .user(userResponse)
                    .build());

        } catch (Exception ex) {
            log.error("Google auth failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication failed: " + ex.getMessage()));
        }
    }
}
