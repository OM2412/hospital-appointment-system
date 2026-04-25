package com.example.hospital.repositories;

import com.example.hospital.models.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    Optional<Hospital> findByName(String name);
    List<Hospital> findByCity(String city);
    List<Hospital> findByState(String state);
    List<Hospital> findByCityAndState(String city, String state);
}
