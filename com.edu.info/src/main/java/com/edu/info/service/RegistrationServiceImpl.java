package com.edu.info.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.info.entity.RegistrationEntity;

import com.edu.info.repository.RegistrationRepository;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    @Autowired
    private RegistrationRepository rrepo;

    @Override
    public RegistrationEntity saveRegistration(RegistrationEntity re) {

      
        String regNumber = "QS-" +
                UUID.randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase();

        
        re.setRegistrationNumber(regNumber);

       
        return rrepo.save(re);
    }

    @Override
    public List<RegistrationEntity> fetchAllRegistration() {
        return rrepo.findAll();
    }

    @Override
    public RegistrationEntity fetchRegistrationByemail(String email) {
        return rrepo.findById(email).orElse(null);
    }

    @Override
    public RegistrationEntity updateRegistration(RegistrationEntity re) {
        return rrepo.save(re);
    }

    @Override
    public void deleteRegistration(String email) {
        rrepo.deleteById(email);
    }
    public RegistrationEntity Plogin(String email, String password) {

        RegistrationEntity provider =
                rrepo.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Provider not found"));

        if(!provider.getPassword().equals(password)){
            throw new RuntimeException("Wrong password");
        }

        return provider;
    }

	

}




    
