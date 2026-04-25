package com.example.hospital.services;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Map;
import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final FileStorageService fileStorageService;

    public GeminiService(WebClient.Builder webClientBuilder, FileStorageService fileStorageService) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta").build();
        this.fileStorageService = fileStorageService;
    }

    public String extractTextFromPdf(String fileName) throws IOException {
        Path filePath = fileStorageService.getFile(fileName);
        try (PDDocument document = Loader.loadPDF(new File(filePath.toString()))) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public Mono<String> getSummary(String text) {
        String prompt = "You are a medical assistant. Summarize the following medical report in simple terms for a patient. " +
                "Highlight key findings, vital signs, and any critical values that require immediate attention. " +
                "Keep it professional yet easy to understand. Do not give medical advice, just summarize the data.\n\n" +
                "Report Text:\n" + text;

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        return webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/models/gemini-1.5-flash:generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    try {
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                        return (String) parts.get(0).get("text");
                    } catch (Exception e) {
                        return "Error parsing AI response: " + e.getMessage();
                    }
                });
    }
}
