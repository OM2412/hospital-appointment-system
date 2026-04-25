package com.example.hospital.controllers;

import com.example.hospital.dto.HospitalDTO;
import com.example.hospital.models.Hospital;
import com.example.hospital.repositories.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        List<HospitalDTO> hospitalDTOs = hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(hospitalDTOs);
    }

    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<HospitalDTO> getHospitalById(@PathVariable Long id) {
        return hospitalRepository.findById(id)
                .map(hospital -> ResponseEntity.ok(convertToDTO(hospital)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<HospitalDTO>> getHospitalsByCity(@PathVariable String city) {
        List<Hospital> hospitals = hospitalRepository.findByCity(city);
        List<HospitalDTO> hospitalDTOs = hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(hospitalDTOs);
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<HospitalDTO>> getHospitalsByState(@PathVariable String state) {
        List<Hospital> hospitals = hospitalRepository.findByState(state);
        List<HospitalDTO> hospitalDTOs = hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(hospitalDTOs);
    }

    @GetMapping("/city/{city}/state/{state}")
    public ResponseEntity<List<HospitalDTO>> getHospitalsByCityAndState(@PathVariable String city, @PathVariable String state) {
        List<Hospital> hospitals = hospitalRepository.findByCityAndState(city, state);
        List<HospitalDTO> hospitalDTOs = hospitals.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(hospitalDTOs);
    }

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<HospitalDTO> createHospital(@RequestBody Hospital hospital) {
        Hospital savedHospital = hospitalRepository.save(hospital);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedHospital));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<HospitalDTO> updateHospital(@PathVariable Long id, @RequestBody Hospital hospitalDetails) {
        return hospitalRepository.findById(id)
                .map(hospital -> {
                    hospital.setName(hospitalDetails.getName());
                    hospital.setAddress(hospitalDetails.getAddress());
                    hospital.setCity(hospitalDetails.getCity());
                    hospital.setState(hospitalDetails.getState());
                    hospital.setPostalCode(hospitalDetails.getPostalCode());
                    hospital.setPhoneNumber(hospitalDetails.getPhoneNumber());
                    hospital.setDescription(hospitalDetails.getDescription());
                    hospital.setRating(hospitalDetails.getRating());
                    Hospital updatedHospital = hospitalRepository.save(hospital);
                    return ResponseEntity.ok(convertToDTO(updatedHospital));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        return hospitalRepository.findById(id)
                .map(hospital -> {
                    hospitalRepository.delete(hospital);
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private HospitalDTO convertToDTO(Hospital hospital) {
        HospitalDTO dto = new HospitalDTO(
                hospital.getId(),
                hospital.getName(),
                hospital.getAddress(),
                hospital.getCity(),
                hospital.getState(),
                hospital.getPostalCode(),
                hospital.getPhoneNumber(),
                hospital.getDescription(),
                hospital.getRating()
        );
        dto.setDoctorCount(hospital.getDoctors().size());
        return dto;
    }
}
