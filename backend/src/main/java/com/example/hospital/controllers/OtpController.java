package com.example.hospital.controllers;

import com.example.hospital.services.EmailService;
import com.example.hospital.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class OtpController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Stores email -> OTP (In-memory for prototype)
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    @PostMapping("/otp/request")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        // Generate 4-digit OTP as requested
        String otp = String.format("%04d", new Random().nextInt(10000));
        otpStorage.put(email, otp);

        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        if (otpStorage.containsKey(email) && otpStorage.get(email).equals(code)) {
            // Success! Generate JWT Token
            String token = jwtTokenProvider.generateTokenFromUsername(email);
            
            // Clean up OTP
            otpStorage.remove(email);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("email", email);
            response.put("role", "patient"); // Default for OTP login
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid or expired OTP");
        }
    }
}
