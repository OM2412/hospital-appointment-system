package com.example.hospital.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        // MUST match the authenticated username in application.properties to avoid auth errors
        message.setFrom("omjadon242@gmail.com"); 
        message.setTo(toEmail);
        message.setSubject("Your Hospital Login OTP");
        message.setText("Hello,\n\nYour 4-digit OTP for logging into the Hospital Appointment System is: " + otp + 
                        "\n\nThis code will expire in 5 minutes. Do not share it with anyone.");
        
        mailSender.send(message);
    }
}
