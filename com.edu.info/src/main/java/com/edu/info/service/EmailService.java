package com.edu.info.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String providerName, String registrationNumber) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("QuickServe Registration Successful");

        message.setText(
                "Hello " + providerName + ",\n\n" +
                "Your QuickServe registration was successful.\n\n" +
                "Your Registration Number is:\n" +
                registrationNumber + "\n\n" +
                "Please save this number.\n\n" +
                "QuickServe Team"
        );

        message.setFrom("Quick-Serve@gmail.com");

        mailSender.send(message);
    }
}
