package com.example.backend.auth;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @GetMapping("/api/auth/me")
    public ResponseEntity<?> me(@RequestAttribute(value = "firebaseUser", required = false) FirebaseToken token) {
        if (token == null) return ResponseEntity.status(401).body(Map.of("error", "unauthenticated"));
        return ResponseEntity.ok(Map.of(
                "uid", token.getUid(),
                "email", token.getEmail(),
                "claims", token.getClaims()
        ));
    }
}
