package com.example.hospital.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType; // PDF, JPG, PNG

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String recordType; // LAB_REPORT, PRESCRIPTION, SCAN, OTHER

    @Column(nullable = false)
    private LocalDateTime uploadDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @Column(length = 20)
    private String analysisStatus = "NOT_ANALYZED"; // NOT_ANALYZED, ANALYZING, COMPLETED, FAILED

    public MedicalRecord() {}

    public MedicalRecord(Patient patient, String fileName, String fileType, String filePath, String recordType) {
        this.patient = patient;
        this.fileName = fileName;
        this.fileType = fileType;
        this.filePath = filePath;
        this.recordType = recordType;
        this.uploadDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getRecordType() { return recordType; }
    public void setRecordType(String recordType) { this.recordType = recordType; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public String getAnalysisStatus() { return analysisStatus; }
    public void setAnalysisStatus(String analysisStatus) { this.analysisStatus = analysisStatus; }
}
