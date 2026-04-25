package com.example.hospital.controllers;

import com.example.hospital.models.MedicalRecord;
import com.example.hospital.models.Patient;
import com.example.hospital.repositories.MedicalRecordRepository;
import com.example.hospital.repositories.PatientRepository;
import com.example.hospital.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private com.example.hospital.services.GeminiService geminiService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getRecords(@PathVariable long patientId) {
        return ResponseEntity.ok(medicalRecordRepository.findByPatientIdOrderByUploadDateDesc(patientId));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadRecord(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") long patientId,
            @RequestParam("recordType") String recordType) {
        
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found");
        }

        try {
            String fileName = fileStorageService.storeFile(file);
            MedicalRecord record = new MedicalRecord(
                    patientOpt.get(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    fileName,
                    recordType
            );
            medicalRecordRepository.save(record);
            return ResponseEntity.status(HttpStatus.CREATED).body(record);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not upload file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = fileStorageService.getFile(fileName);
            java.net.URI uri = filePath.toUri();
            Resource resource = new UrlResource(java.util.Objects.requireNonNull(uri));

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/analyze")
    public Mono<ResponseEntity<?>> analyzeRecord(@PathVariable long id) {
        Optional<MedicalRecord> recordOpt = medicalRecordRepository.findById(id);
        if (recordOpt.isEmpty()) {
            return Mono.just(ResponseEntity.notFound().build());
        }

        MedicalRecord record = recordOpt.get();
        if (!"application/pdf".equals(record.getFileType()) && !record.getFileName().toLowerCase().endsWith(".pdf")) {
            return Mono.just(ResponseEntity.badRequest().body("Only PDF files are supported for AI analysis at the moment."));
        }

        record.setAnalysisStatus("ANALYZING");
        medicalRecordRepository.save(record);

        try {
            String text = geminiService.extractTextFromPdf(record.getFilePath());
            return geminiService.getSummary(text)
                    .<ResponseEntity<?>>map(summary -> {
                        record.setAiSummary(summary);
                        record.setAnalysisStatus("COMPLETED");
                        medicalRecordRepository.save(record);
                        return ResponseEntity.ok(record);
                    })
                    .onErrorResume(e -> {
                        record.setAnalysisStatus("FAILED");
                        medicalRecordRepository.save(record);
                        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("AI Analysis failed: " + e.getMessage()));
                    });
        } catch (Exception e) {
            record.setAnalysisStatus("FAILED");
            medicalRecordRepository.save(record);
            return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Text extraction failed: " + e.getMessage()));
        }
    }
}
