package com.example.hospital.controllers;

import com.example.hospital.models.Notification;
import com.example.hospital.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable long patientId) {
        return ResponseEntity.ok(notificationRepository.findByPatientIdOrderByCreatedAtDesc(patientId));
    }

    @GetMapping("/patient/{patientId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable long patientId) {
        return ResponseEntity.ok(notificationRepository.findByPatientIdAndIsReadFalseOrderByCreatedAtDesc(patientId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable long id) {
        Optional<Notification> notificationOpt = notificationRepository.findById(id);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
