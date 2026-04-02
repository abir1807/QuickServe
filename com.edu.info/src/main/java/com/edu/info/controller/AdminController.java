package com.edu.info.controller;

import com.edu.info.entity.BookingEntity;
import com.edu.info.entity.Category;
import com.edu.info.entity.RegistrationEntity;
import com.edu.info.entity.ServiceDetailsEntity;
import com.edu.info.entity.ServiceEntity;
import com.edu.info.entity.UserEntity;
import com.edu.info.repository.BookingRepository;
import com.edu.info.repository.CategoryRepository;
import com.edu.info.repository.RegistrationRepository;
import com.edu.info.repository.ServiceDetailsRepository;
import com.edu.info.repository.ServiceRepository;
import com.edu.info.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    // ✅ HARDCODED ADMIN CREDENTIALS
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin@123";

    @Autowired
    private RegistrationRepository registrationRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private ServiceRepository serviceRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private ServiceDetailsRepository serviceDetailsRepo;
    // ══════════════════════════════════════════
    // 1️⃣ ADMIN LOGIN
    // ══════════════════════════════════════════
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (ADMIN_USERNAME.equals(username) &&
            ADMIN_PASSWORD.equals(password)) {
            return ResponseEntity.ok(Map.of(
                "message", "Login Successful",
                "role", "ADMIN"
            ));
        }
        return new ResponseEntity<>(
            "Invalid credentials",
            HttpStatus.UNAUTHORIZED
        );
    }

    // ══════════════════════════════════════════
    // 2️⃣ GET ALL PROVIDERS (verified + unverified)
    // ══════════════════════════════════════════
    @GetMapping("/providers")
    public List<RegistrationEntity> getAllProviders() {
        return registrationRepo.findAll();
    }

    // ══════════════════════════════════════════
    // 3️⃣ GET PENDING (unverified) PROVIDERS
    // ══════════════════════════════════════════
    @GetMapping("/providers/pending")
    public List<RegistrationEntity> getPendingProviders() {
        return registrationRepo.findByIsVerified(false);
    }

    // ══════════════════════════════════════════
    // 4️⃣ VERIFY PROVIDER
    // ══════════════════════════════════════════
    @PutMapping("/verify/{email}")
    public ResponseEntity<?> verifyProvider(@PathVariable String email) {
        RegistrationEntity provider =
            registrationRepo.findById(email).orElse(null);
        if (provider == null)
            return new ResponseEntity<>("Provider not found", HttpStatus.NOT_FOUND);

        provider.setVerified(true);
        registrationRepo.save(provider);
        return ResponseEntity.ok("Provider Verified ✅");
    }

    // ══════════════════════════════════════════
    // 5️⃣ REJECT / DELETE PROVIDER
    // ══════════════════════════════════════════
    @DeleteMapping("/reject/{email}")
    public ResponseEntity<?> rejectProvider(@PathVariable String email) {
        RegistrationEntity provider =
            registrationRepo.findById(email).orElse(null);
        if (provider == null)
            return new ResponseEntity<>("Provider not found", HttpStatus.NOT_FOUND);

        registrationRepo.deleteById(email);
        return ResponseEntity.ok("Provider Rejected ❌");
    }

    // ══════════════════════════════════════════
    // 6️⃣ GET ALL USERS
    // ══════════════════════════════════════════
    @GetMapping("/users")
    public List<UserEntity> getAllUsers() {
        return userRepo.findAll();
    }

    // ══════════════════════════════════════════
    // 7️⃣ DELETE USER
    // ══════════════════════════════════════════
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok("User Deleted");
    }

    // ══════════════════════════════════════════
    // 8️⃣ GET ALL BOOKINGS
    // ══════════════════════════════════════════
    @GetMapping("/bookings")
    public List<BookingEntity> getAllBookings() {
        return bookingRepo.findAll();
    }

    // ══════════════════════════════════════════
    // 9️⃣ GET STATS
    // ══════════════════════════════════════════
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
            "totalProviders", registrationRepo.count(),
            "pendingProviders", registrationRepo.findByIsVerified(false).size(),
            "totalUsers",    userRepo.count(),
            "totalBookings", bookingRepo.count(),
            "totalCategories", categoryRepo.count(),
            "totalServices", serviceRepo.count()
        ));
    }
    
 // GET ALL PENDING SERVICES
    @GetMapping("/services/pending")
    public List<ServiceDetailsEntity> getPendingServices() {
        return serviceDetailsRepo.findAll()
            .stream()
            .filter(s -> "PENDING".equals(s.getStatus()))
            .collect(java.util.stream.Collectors.toList());
    }

    // GET ALL SERVICES
    @GetMapping("/services/all")
    public List<ServiceDetailsEntity> getAllServices() {
        return serviceDetailsRepo.findAll();
    }

    // APPROVE SERVICE
    @PutMapping("/service/approve/{id}")
    public ResponseEntity<?> approveService(@PathVariable Integer id) {
        ServiceDetailsEntity s = serviceDetailsRepo.findById(id).orElse(null);
        if (s == null) return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        s.setStatus("APPROVED");
        serviceDetailsRepo.save(s);
        return ResponseEntity.ok("Service Approved ✅");
    }

    // REJECT SERVICE
    @PutMapping("/service/reject/{id}")
    public ResponseEntity<?> rejectService(@PathVariable Integer id) {
        ServiceDetailsEntity s = serviceDetailsRepo.findById(id).orElse(null);
        if (s == null) return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        s.setStatus("REJECTED");
        serviceDetailsRepo.save(s);
        return ResponseEntity.ok("Service Rejected ❌");
    }
}