package com.edu.info.service;

import java.util.List;

import com.edu.info.entity.BookingEntity;

public interface BookingService {

    BookingEntity createBooking(BookingEntity booking);

    List<BookingEntity> getProviderBookings(String email);

    BookingEntity updateStatus(Integer id, String status);

	List<BookingEntity> getUserBookings(String email);
    
   

}
