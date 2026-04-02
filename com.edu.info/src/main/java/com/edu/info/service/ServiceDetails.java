package com.edu.info.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edu.info.entity.ServiceDetailsEntity;
import com.edu.info.repository.ServiceDetailsRepository;

@Service
public class ServiceDetails {

    @Autowired
    private ServiceDetailsRepository repo;


    // ADD SERVICE
    public ServiceDetailsEntity addService(
            ServiceDetailsEntity s){

        return repo.save(s);

    }


    // FETCH PROVIDER SERVICES
    public List<ServiceDetailsEntity>
    getServices(String email){

        return repo.findByProviderEmail(email);

    }


    // DELETE
    public void deleteService(int id){

        repo.deleteById(id);

    }

}