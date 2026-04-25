package com.example.hospital.repositories;

import com.example.hospital.models.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientIdOrderByUploadDateDesc(Long patientId);
}
