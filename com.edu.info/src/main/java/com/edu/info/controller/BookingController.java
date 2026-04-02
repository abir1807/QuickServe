package com.edu.info.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edu.info.entity.BookingEntity;
import com.edu.info.repository.BookingRepository;
import com.edu.info.service.BookingService;

@RestController
@RequestMapping("/booking")
@CrossOrigin("*")

public class BookingController {

    @Autowired
    BookingService service;
    @Autowired
    private BookingRepository repo;
    @PostMapping("/create")
    public BookingEntity create(@RequestBody BookingEntity booking){
        return service.createBooking(booking);
    }

    @GetMapping("/provider/{email}")
    public List<BookingEntity> providerBookings(@PathVariable String email){
        return service.getProviderBookings(email);
    }

    @PutMapping("/status/{id}/{status}")
    public BookingEntity update(@PathVariable Integer id,
                                @PathVariable String status){
        return service.updateStatus(id,status);
    }

    @GetMapping("/user/{email}")
    public List<BookingEntity> userBookings(@PathVariable String email){
        return service.getUserBookings(email);
    }
    @DeleteMapping("/booking/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        BookingEntity b = repo.findById(id).orElse(null);
        if (b == null) {
            return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
        }
        if (!b.getStatus().equals("PENDING")) {
            return new ResponseEntity<>("Only PENDING bookings can be cancelled", HttpStatus.BAD_REQUEST);
        }
        repo.deleteById(id);
        return ResponseEntity.ok("Booking Cancelled");
    }

}