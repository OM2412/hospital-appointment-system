package com.example.hospital.dto;

public class DoctorDTO {
    private Long id;
    private String name;
    private String specialty;
    private String qualifications;
    private Integer yearsOfExperience;
    private Double rating;
    private String phoneNumber;
    private String email;
    private String availableSlots;
    private HospitalDTO hospital;

    public DoctorDTO() {}

    public DoctorDTO(Long id, String name, String specialty, String qualifications, Integer yearsOfExperience, Double rating, String phoneNumber, String email, String availableSlots) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
        this.qualifications = qualifications;
        this.yearsOfExperience = yearsOfExperience;
        this.rating = rating;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.availableSlots = availableSlots;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(String availableSlots) {
        this.availableSlots = availableSlots;
    }

    public HospitalDTO getHospital() {
        return hospital;
    }

    public void setHospital(HospitalDTO hospital) {
        this.hospital = hospital;
    }
}
