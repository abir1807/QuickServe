package com.edu.info.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.info.entity.UserEntity;
import com.edu.info.repository.UserRepository;
import com.edu.info.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository repo;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public UserEntity register(UserEntity user) {
        return repo.save(user);
    }

    @Override
    public String login(String emailOrPhone, String password) {

        UserEntity user = repo.findByEmail(emailOrPhone);

        if (user == null) {
            user = repo.findByContactNumber(emailOrPhone);
        }

        if (user != null && user.getPassword().equals(password)) {

            // ✅ generate JWT token
            return jwtUtil.generateToken(user.getEmail());
        }

        return null;
    }
    public UserEntity findUser(String emailOrPhone, String password){

        UserEntity user = repo.findByEmail(emailOrPhone);

        if(user == null){
            user = repo.findByContactNumber(emailOrPhone);
        }

        if(user != null && user.getPassword().equals(password)){
            return user;
        }

        return null;
    }
}