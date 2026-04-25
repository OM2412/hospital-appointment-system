/*
package com.example.hospital.controllers;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    // IMPORTANT: Replace with environment variables in production
    private final String KEY_ID = "rzp_test_SgUPjPYH2Fwsqt";
    private final String KEY_SECRET = "0uIUrteT2BFGiCV2EhVa4Sr4";

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            RazorpayClient razorpay = new RazorpayClient(KEY_ID, KEY_SECRET);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) data.get("amount") * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");

        System.out.println("Verifying Payment: " + paymentId + " for Order: " + orderId);

        // Logic to verify signature using Razorpay SDK
        // In a real app, we would verify the signature here
        // If valid, update the appointment status to "PAID" in the database

        return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully"));
    }
}
*/
