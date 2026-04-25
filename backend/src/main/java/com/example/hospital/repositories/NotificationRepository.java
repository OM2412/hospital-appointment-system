package com.example.hospital.repositories;

import com.example.hospital.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Notification> findByPatientIdAndIsReadFalseOrderByCreatedAtDesc(Long patientId);
}
