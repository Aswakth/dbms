package com.example.backend.auth;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class FirebaseInitializer {

    private static final Logger log = LoggerFactory.getLogger(FirebaseInitializer.class);

    @PostConstruct
    public void init() {
        try {
            // Look for service account key at a path configurable by env var or default location
            String pathStr = System.getenv().getOrDefault("FIREBASE_SERVICE_ACCOUNT", "firebase-service-account.json");
            Path path = Path.of(pathStr);
            if (!Files.exists(path)) {
                log.info("Firebase service account not found at {} — Firebase Admin SDK will not be initialized. Set FIREBASE_SERVICE_ACCOUNT to enable Firebase features.", path.toAbsolutePath());
                return;
            }

            try (FileInputStream serviceAccount = new FileInputStream(path.toFile())) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                    log.info("Firebase Admin SDK initialized using service account at {}", path.toAbsolutePath());
                }
            }
        } catch (Exception e) {
            // Don't fail application startup if Firebase can't be initialized; log and continue.
            log.warn("Failed to initialize Firebase Admin SDK — Firebase features will be disabled", e);
        }
    }
}
