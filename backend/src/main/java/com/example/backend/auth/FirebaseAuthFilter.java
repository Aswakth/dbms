package com.example.backend.auth;

import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private final FirebaseTokenVerifier verifier;

    public FirebaseAuthFilter(FirebaseTokenVerifier verifier) {
        this.verifier = verifier;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        String auth = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                FirebaseToken decoded = verifier.verifyToken(token);
                req.setAttribute("firebaseUser", decoded);
            } catch (Exception e) {
                // invalid token - ignore and continue unauthenticated
            }
        }
        chain.doFilter(req, res);
    }
}
