package com.edu.info.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edu.info.entity.BookingEntity;

public interface BookingRepository extends JpaRepository<BookingEntity,Integer> {

    List<BookingEntity> findByProviderEmail(String email);

    List<BookingEntity> findByUserEmail(String email);
    
    
}