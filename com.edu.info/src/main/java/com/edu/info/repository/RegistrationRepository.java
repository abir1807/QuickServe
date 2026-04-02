package com.edu.info.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edu.info.entity.RegistrationEntity;

public interface RegistrationRepository extends JpaRepository<RegistrationEntity, String>{
	 Optional<RegistrationEntity> findByEmail(String email);

	 List<RegistrationEntity> findByIsVerified(boolean isVerified);
}
