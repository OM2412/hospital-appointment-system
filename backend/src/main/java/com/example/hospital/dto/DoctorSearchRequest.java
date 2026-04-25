package com.example.hospital.dto;

public class DoctorSearchRequest {
    private String specialty;
    private String city;
    private String hospitalId;
    private Double minRating;

    public DoctorSearchRequest() {}

    public DoctorSearchRequest(String specialty, String city, String hospitalId, Double minRating) {
        this.specialty = specialty;
        this.city = city;
        this.hospitalId = hospitalId;
        this.minRating = minRating;
    }

    // Getters and Setters
    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }
}
