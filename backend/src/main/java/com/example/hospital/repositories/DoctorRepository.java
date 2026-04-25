package com.example.hospital.repositories;

import com.example.hospital.models.Doctor;
import com.example.hospital.models.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialty(String specialty);
    List<Doctor> findByHospital(Hospital hospital);
    List<Doctor> findBySpecialtyAndHospital(String specialty, Hospital hospital);
    List<Doctor> findBySpecialtyContainingIgnoreCase(String specialty);
    List<Doctor> findByHospitalCity(String city);
    List<Doctor> findByHospitalCityAndSpecialty(String city, String specialty);
}
