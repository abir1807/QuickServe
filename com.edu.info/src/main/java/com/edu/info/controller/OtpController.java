package com.edu.info.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.edu.info.service.OtpService;

@RestController
@CrossOrigin
@RequestMapping("/otp")
public class OtpController {

    @Autowired
    OtpService otpService;
    

    @PostMapping("/send")
    public String sendOtp(@RequestParam String phone){

        otpService.generateOtp(phone);

        return "OTP Sent";
    }


    @PostMapping("/verify")
    public String verifyOtp(@RequestParam String phone,@RequestParam String otp){

        boolean valid = otpService.verifyOtp(phone, otp);

        if(valid){

            return "Login Successful";

        }

        return "Invalid OTP";

    }

}