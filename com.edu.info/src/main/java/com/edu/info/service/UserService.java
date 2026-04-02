package com.edu.info.service;

import com.edu.info.entity.UserEntity;

public interface UserService {

    UserEntity register(UserEntity user);

    String login(String emailOrPhone, String password);

	UserEntity findUser(String emailOrPhone, String password);

}