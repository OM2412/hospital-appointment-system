package com.example.hospital.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false, length = 1000)
    private String medications; // JSON or comma-separated string

    @Column(length = 1000)
    private String instructions;

    @Column(nullable = false)
    private LocalDate issuedDate = LocalDate.now();

    @Column(nullable = false)
    private LocalDate expiryDate;

    public Prescription() {}

    public Prescription(Appointment appointment, String medications, String instructions, LocalDate expiryDate) {
        this.appointment = appointment;
        this.medications = medications;
        this.instructions = instructions;
        this.expiryDate = expiryDate;
        this.issuedDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public LocalDate getIssuedDate() { return issuedDate; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
