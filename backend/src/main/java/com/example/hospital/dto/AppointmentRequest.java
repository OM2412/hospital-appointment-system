package com.example.hospital.dto;

public class AppointmentRequest {
    private Long doctorId;
    private Long patientId;
    private String date;
    private String time;

    public AppointmentRequest() {}

    public AppointmentRequest(Long doctorId, Long patientId, String date, String time) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.date = date;
        this.time = time;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
