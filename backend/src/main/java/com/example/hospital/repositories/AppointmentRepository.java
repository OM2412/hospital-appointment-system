package com.example.hospital.repositories;

import com.example.hospital.models.Appointment;
import com.example.hospital.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByPatientEmail(String email);
    List<Appointment> findByDate(String date);
}
