package com.edu.info.service;

import java.util.List;

import com.edu.info.entity.RegistrationEntity;


public interface RegistrationService {

	RegistrationEntity saveRegistration(RegistrationEntity re);

	List<RegistrationEntity> fetchAllRegistration();

	//RegistrationEntity fetchRegistrationByRegNo(int regNo);

	RegistrationEntity updateRegistration(RegistrationEntity re);

	//void deleteRegistration(int regNo);

	void deleteRegistration(String email);

	//RegistrationEntity fetchRegistrationByRegNo(String email);

	RegistrationEntity fetchRegistrationByemail(String email);

	RegistrationEntity Plogin(String email, String password);

	
	
	






}
