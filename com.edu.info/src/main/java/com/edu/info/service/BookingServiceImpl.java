package com.edu.info.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.edu.info.controller.ServiceController;
import com.edu.info.entity.BookingEntity;
import com.edu.info.repository.BookingRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private final ServiceController serviceController;

    @Autowired
    BookingRepository repo;

    BookingServiceImpl(ServiceController serviceController) {
        this.serviceController = serviceController;
    }

    @Override
    public BookingEntity createBooking(BookingEntity booking) {

        booking.setStatus("PENDING");

        return repo.save(booking);
    }

    @Override
    public List<BookingEntity> getProviderBookings(String email) {

        return repo.findByProviderEmail(email);
    }

    @Override
    public BookingEntity updateStatus(Integer id, String status) {

        BookingEntity b = repo.findById(id).get();

        b.setStatus(status);

        return repo.save(b);
    }
    public List<BookingEntity> getUserBookings(String email){
        return repo.findByUserEmail(email);
    }
}