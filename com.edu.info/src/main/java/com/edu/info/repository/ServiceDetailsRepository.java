package com.edu.info.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.edu.info.entity.ServiceDetailsEntity;

public interface ServiceDetailsRepository
        extends JpaRepository<ServiceDetailsEntity,Integer>{

    List<ServiceDetailsEntity> findByProviderEmail(String providerEmail);

    List<ServiceDetailsEntity> findByServiceId(Integer serviceId);

}