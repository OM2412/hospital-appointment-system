package com.example.hospital.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
@CrossOrigin(origins = "*")
public class SystemHealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<List<Map<String, Object>>> getSystemHealth() {
        List<Map<String, Object>> healthReport = new ArrayList<>();

        // 1. Database Status
        healthReport.add(createHealthItem("Database Status", checkDatabaseStatus() ? "Online" : "Offline", "Server", checkDatabaseStatus() ? "success" : "danger"));

        // 2. API Server
        healthReport.add(createHealthItem("API Server", "Running", "Activity", "success"));

        // 3. Email Service
        healthReport.add(createHealthItem("Email Service", "Active", "Mail", "success"));

        // 4. SMS Gateway
        healthReport.add(createHealthItem("SMS Gateway", "Active", "Smartphone", "success"));

        return ResponseEntity.ok(healthReport);
    }

    private Map<String, Object> createHealthItem(String label, String status, String icon, String color) {
        Map<String, Object> item = new HashMap<>();
        item.put("label", label);
        item.put("status", status);
        item.put("icon", icon);
        item.put("color", color);
        return item;
    }

    private boolean checkDatabaseStatus() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(1000);
        } catch (Exception e) {
            return false;
        }
    }
}
