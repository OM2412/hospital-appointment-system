package com.example.hospital.controllers;

import com.example.hospital.dto.*;
import com.example.hospital.models.Appointment;
import com.example.hospital.models.Doctor;
import com.example.hospital.models.Hospital;
import com.example.hospital.models.Patient;
import com.example.hospital.repositories.AppointmentRepository;
import com.example.hospital.repositories.DoctorRepository;
import com.example.hospital.repositories.HospitalRepository;
import com.example.hospital.repositories.PatientRepository;
import com.example.hospital.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;


    // Initialize sample hospital data on application startup
    @EventListener(ApplicationReadyEvent.class)
    @SuppressWarnings("null")
    public void initializeHospitalData() {
        if (hospitalRepository.count() == 0) {
            // Sample hospitals in Gwalior, Madhya Pradesh, India
            Hospital hospital1 = new Hospital(
                    "Apollo Specialty Hospital",
                    "Madhav Vihar, Opposite Metro Station, Laxmi Nagar",
                    "Gwalior",
                    "Madhya Pradesh",
                    "474001",
                    "+91-751-443-0000",
                    "Multi-specialty hospital with advanced diagnostic facilities and experienced medical professionals."
            );
            hospital1.setRating(4.8);

            Hospital hospital2 = new Hospital(
                    "Surya Super Specialty Hospital",
                    "342, Jayendraganj Road, Near Vijaya Cinema",
                    "Gwalior",
                    "Madhya Pradesh",
                    "474002",
                    "+91-751-423-2323",
                    "Leading healthcare center specializing in cardiology, orthopedics, and emergency care."
            );
            hospital2.setRating(4.6);

            Hospital hospital3 = new Hospital(
                    "Aastha Fertility Centre & IVF Hospital",
                    "Plot No. 5-A, Kampoo Road, Civil Lines",
                    "Gwalior",
                    "Madhya Pradesh",
                    "474003",
                    "+91-751-413-3000",
                    "Specialized fertility and women's health center with modern equipment."
            );
            hospital3.setRating(4.7);

            Hospital hospital4 = new Hospital(
                    "Shanti Nursing Home",
                    "B-58, Kailash Nagar, Rewa Road",
                    "Gwalior",
                    "Madhya Pradesh",
                    "474004",
                    "+91-751-434-5555",
                    "General practice and emergency care facility serving the local community."
            );
            hospital4.setRating(4.5);

            hospitalRepository.saveAll(List.of(hospital1, hospital2, hospital3, hospital4));

            // Sample doctors in Gwalior hospitals
            Doctor doctor1 = new Doctor("Dr. Rajesh Sharma", "Cardiology", hospital1);
            doctor1.setQualifications("MD (Medicine), DM (Cardiology), FACC");
            doctor1.setYearsOfExperience(16);
            doctor1.setRating(4.9);
            doctor1.setEmail("rajesh.sharma@apollogwalior.com");
            doctor1.setPhoneNumber("+91-9826-123-456");
            doctor1.setAvailableSlots("9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM");

            Doctor doctor2 = new Doctor("Dr. Priya Verma", "General Practice", hospital1);
            doctor2.setQualifications("MBBS, MD (Family Medicine)");
            doctor2.setYearsOfExperience(10);
            doctor2.setRating(4.7);
            doctor2.setEmail("priya.verma@apollogwalior.com");
            doctor2.setPhoneNumber("+91-9876-234-567");
            doctor2.setAvailableSlots("10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM");

            Doctor doctor3 = new Doctor("Dr. Anil Mishra", "Orthopedics", hospital2);
            doctor3.setQualifications("MBBS, MS (Orthopedics), FIJO");
            doctor3.setYearsOfExperience(18);
            doctor3.setRating(4.9);
            doctor3.setEmail("anil.mishra@suryahospital.com");
            doctor3.setPhoneNumber("+91-9845-345-678");
            doctor3.setAvailableSlots("9:30 AM - 12:00 PM, 3:00 PM - 6:30 PM");

            Doctor doctor4 = new Doctor("Dr. Meera Singh", "Pediatrics", hospital2);
            doctor4.setQualifications("MBBS, MD (Pediatrics), FIAP");
            doctor4.setYearsOfExperience(12);
            doctor4.setRating(4.8);
            doctor4.setEmail("meera.singh@suryahospital.com");
            doctor4.setPhoneNumber("+91-9834-456-789");
            doctor4.setAvailableSlots("10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM");

            Doctor doctor5 = new Doctor("Dr. Neha Gupta", "Gynecology & Obstetrics", hospital3);
            doctor5.setQualifications("MBBS, DGO, Fellowship in Reproductive Medicine");
            doctor5.setYearsOfExperience(14);
            doctor5.setRating(4.8);
            doctor5.setEmail("neha.gupta@aasthafertility.com");
            doctor5.setPhoneNumber("+91-9812-567-890");
            doctor5.setAvailableSlots("10:00 AM - 12:00 PM, 5:00 PM - 8:00 PM");

            Doctor doctor6 = new Doctor("Dr. Vikram Patel", "ENT (Ear, Nose, Throat)", hospital4);
            doctor6.setQualifications("MBBS, MS (ENT), FIES");
            doctor6.setYearsOfExperience(13);
            doctor6.setRating(4.6);
            doctor6.setEmail("vikram.patel@shantinursing.com");
            doctor6.setPhoneNumber("+91-9867-678-901");
            doctor6.setAvailableSlots("9:00 AM - 11:30 AM, 3:30 PM - 6:30 PM");

            Doctor doctor7 = new Doctor("Dr. Anjali Jain", "Dermatology", hospital1);
            doctor7.setQualifications("MBBS, MD (Dermatology), IADVL");
            doctor7.setYearsOfExperience(9);
            doctor7.setRating(4.7);
            doctor7.setEmail("anjali.jain@apollogwalior.com");
            doctor7.setPhoneNumber("+91-9823-789-012");
            doctor7.setAvailableSlots("11:00 AM - 1:00 PM, 5:00 PM - 7:30 PM");

            Doctor doctor8 = new Doctor("Dr. Suresh Kumar", "General Practice", hospital4);
            doctor8.setQualifications("MBBS, MD (Internal Medicine)");
            doctor8.setYearsOfExperience(11);
            doctor8.setRating(4.5);
            doctor8.setEmail("suresh.kumar@shantinursing.com");
            doctor8.setPhoneNumber("+91-9856-890-123");
            doctor8.setAvailableSlots("8:00 AM - 12:00 PM, 3:00 PM - 7:00 PM");

            doctorRepository.saveAll(List.of(doctor1, doctor2, doctor3, doctor4, doctor5, doctor6, doctor7, doctor8));
        }
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from backend API!");
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Mock login - replace with database user validation in production
        String token = jwtTokenProvider.generateTokenFromUsername(loginRequest.getUsername());
        String role = loginRequest.getUsername().toLowerCase().contains("doctor") ? "doctor" : "patient";
        LoginResponse response = new LoginResponse(token, loginRequest.getUsername(), role);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody LoginRequest loginRequest) {
        // Find or create patient - for now, create a simple mock
        Optional<Patient> existingPatient = patientRepository.findByEmail(loginRequest.getUsername() + "@hospital.com");
        if (existingPatient.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Patient already exists");
        }

        Patient patient = new Patient();
        patient.setName(loginRequest.getUsername());
        patient.setEmail(loginRequest.getUsername() + "@hospital.com");
        patientRepository.save(patient);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Patient registered successfully");
        response.put("patientId", patient.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== DOCTOR ENDPOINTS ====================

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertDoctorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @GetMapping("/doctors/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(doctor -> ResponseEntity.ok(convertDoctorToDTO(doctor)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/doctors/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialty(@PathVariable String specialty) {
        List<Doctor> doctors = doctorRepository.findBySpecialtyContainingIgnoreCase(specialty);
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertDoctorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @GetMapping("/doctors/city/{city}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByCity(@PathVariable String city) {
        List<Doctor> doctors = doctorRepository.findByHospitalCity(city);
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertDoctorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @GetMapping("/doctors/city/{city}/specialty/{specialty}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByCityAndSpecialty(@PathVariable String city, @PathVariable String specialty) {
        List<Doctor> doctors = doctorRepository.findByHospitalCityAndSpecialty(city, specialty);
        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertDoctorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    @PostMapping("/doctors/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestBody DoctorSearchRequest searchRequest) {
        List<Doctor> doctors = doctorRepository.findAll();

        // Filter by specialty if provided
        if (searchRequest.getSpecialty() != null && !searchRequest.getSpecialty().isEmpty()) {
            doctors = doctors.stream()
                    .filter(d -> d.getSpecialty().toLowerCase().contains(searchRequest.getSpecialty().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Filter by city if provided
        if (searchRequest.getCity() != null && !searchRequest.getCity().isEmpty()) {
            doctors = doctors.stream()
                    .filter(d -> d.getHospital().getCity().toLowerCase().contains(searchRequest.getCity().toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Filter by hospital if provided
        if (searchRequest.getHospitalId() != null && !searchRequest.getHospitalId().isEmpty()) {
            try {
                Long hospitalId = Long.parseLong(searchRequest.getHospitalId());
                doctors = doctors.stream()
                        .filter(d -> d.getHospital().getId().equals(hospitalId))
                        .collect(Collectors.toList());
            } catch (NumberFormatException e) {
                // Invalid hospital ID, ignore filter
            }
        }

        // Filter by minimum rating if provided
        if (searchRequest.getMinRating() != null) {
            doctors = doctors.stream()
                    .filter(d -> d.getRating() >= searchRequest.getMinRating())
                    .collect(Collectors.toList());
        }

        List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(this::convertDoctorToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctorDTOs);
    }

    // ==================== PATIENT ENDPOINTS ====================

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getPatients() {
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty()) {
            // Populate with sample data if empty
            patientRepository.save(new Patient(null, "John Doe", "john@example.com"));
            patientRepository.save(new Patient(null, "Jane Smith", "jane@example.com"));
            patients = patientRepository.findAll();
        }
        return ResponseEntity.ok(patients);
    }

    // ==================== APPOINTMENT ENDPOINTS ====================

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/appointments")
    @SuppressWarnings("null")
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request) {
        try {
            Optional<Doctor> doctor = doctorRepository.findById(request.getDoctorId());
            Optional<Patient> patient = patientRepository.findById(request.getPatientId());

            if (doctor.isEmpty() || patient.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor or Patient not found");
            }

            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor.get());
            appointment.setPatient(patient.get());
            appointment.setDate(request.getDate());
            appointment.setTime(request.getTime());

            Appointment saved = appointmentRepository.save(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating appointment: " + e.getMessage());
        }
    }

    @GetMapping("/appointments/patient/{patientId}")
    @SuppressWarnings("null")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId) {
        try {
            Optional<Patient> patient = patientRepository.findById(patientId);
            if (patient.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found");
            }
            List<Appointment> appointments = appointmentRepository.findByPatient(patient.get());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error retrieving appointments: " + e.getMessage());
        }
    }

    // ==================== HELPER METHODS ====================

    private DoctorDTO convertDoctorToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialty(),
                doctor.getQualifications(),
                doctor.getYearsOfExperience(),
                doctor.getRating(),
                doctor.getPhoneNumber(),
                doctor.getEmail(),
                doctor.getAvailableSlots()
        );
        dto.setHospital(convertHospitalToDTO(doctor.getHospital()));
        return dto;
    }

    private HospitalDTO convertHospitalToDTO(Hospital hospital) {
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
