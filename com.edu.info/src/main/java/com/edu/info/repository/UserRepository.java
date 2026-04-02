package com.edu.info.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.edu.info.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity,Integer>{

    UserEntity findByEmail(String email);

    UserEntity findByContactNumber(String contactNumber);

}