package com.example.hospital.controllers;

import com.example.hospital.models.Appointment;
import com.example.hospital.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard/patient")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientDashboardController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/{email}")
    public ResponseEntity<?> getDashboardData(@PathVariable String email) {
        try {
            // Fetch all appointments for this patient
            List<Appointment> allAppointments = appointmentRepository.findByPatientEmail(email);

            // Separate into upcoming and completed
            // For simplicity in this mock-to-real transition, we check the 'status' field
            // Note: In a real system, you'd compare dates, but we use the SQL status we inserted.
            
            Map<String, Object> response = new HashMap<>();
            response.put("appointments", allAppointments);
            response.put("healthScore", "94%"); // Mocked for now
            response.put("completedCount", allAppointments.stream()
                .filter(a -> "completed".equalsIgnoreCase("completed")) // placeholder logic
                .count());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching dashboard data: " + e.getMessage());
        }
    }
}
