package com.edu.info.service;

import java.util.HashMap;
import java.util.Random;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    HashMap<String,String> otpStore = new HashMap<>();


    public String generateOtp(String phone){

        Random random = new Random();

        String otp = String.valueOf(100000 + random.nextInt(900000));

        otpStore.put(phone, otp);

        System.out.println("OTP for "+phone+" : "+otp);

        return otp;
    }


    public boolean verifyOtp(String phone,String otp){

        if(otpStore.containsKey(phone) && otpStore.get(phone).equals(otp)){

            otpStore.remove(phone);

            return true;
        }

        return false;
    }

}