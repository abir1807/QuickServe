package com.edu.info.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edu.info.entity.UserEntity;
import com.edu.info.security.JwtUtil;
import com.edu.info.service.UserService;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public UserEntity register(@RequestBody UserEntity user){
        return service.register(user);
    }

    // LOGIN WITH EMAIL OR PHONE
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){

        String emailOrPhone = body.get("email");
        String password = body.get("password");

        UserEntity user = service.findUser(emailOrPhone, password);

        if(user == null){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("name", user.getName());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response);
    }
}