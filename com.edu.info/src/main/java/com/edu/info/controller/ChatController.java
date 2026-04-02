package com.edu.info.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/chat")
public class ChatController {                    

    private static final String API_KEY = "AIzaSyC7_FIcJ_6F7jUdpIU4SmjQA1VtPDCsaCI";
    private static final String API_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    @PostMapping("/ask")
    public ResponseEntity<String> chat(@RequestBody Map<String, Object> body) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String userMessage = "";
            var messages = (java.util.List<Map<String, String>>) body.get("messages");
            if (messages != null && !messages.isEmpty()) {
                userMessage = messages.get(messages.size() - 1).get("content");
            }

            String requestBody = """
                {
                  "contents": [{
                    "parts": [{
                      "text": "You are a helpful assistant for QuickServe, a premium local service booking platform in India. QuickServe connects users with verified service providers across categories like Home Services, Electronics Repair, Healthcare, Beauty and Wellness, Education, Sports, Food Service and more. Keep answers short and friendly. Question: %s"
                    }]
                  }]
                }
                """.formatted(userMessage);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                API_URL + API_KEY, request, String.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

}                                                