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
import org.springframework.web.bind.annotation.RestController;

import com.edu.info.entity.RegistrationEntity;
import com.edu.info.service.EmailService;
import com.edu.info.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
@CrossOrigin("*")
@RestController
public class RegistrationController {

    @Autowired
    private RegistrationService service;
    
    @Autowired
    private EmailService emailService;

    @Operation(summary = "Create a new Registration", description = "Add a new Registration to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description="Registration Created"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
    @PostMapping("/addr")
    public RegistrationEntity add(@Valid @RequestBody RegistrationEntity r) {

        
        RegistrationEntity saved = service.saveRegistration(r);

        emailService.sendRegistrationEmail(
                saved.getEmail(),
                saved.getProviderName(),
                saved.getRegistrationNumber()
        );

        return saved;
    }

    @Operation(summary = "All Registration details", description = "get all Registration")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description=" ur Registration"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
    @GetMapping("/fetchr")
    public List<RegistrationEntity> fetchAll() {
        return service.fetchAllRegistration();
    }
    
    @Operation(summary = "search Registration by email", description = "Search a  Registration by email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description=" search Registration"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
    @GetMapping("/fetchr/{email}")
    public ResponseEntity<?> fetchById(@PathVariable String email) {
        RegistrationEntity r = service.fetchRegistrationByemail(email);
        if (r != null)
            return ResponseEntity.ok(r);
        else
            return new ResponseEntity<>("Data not Found", HttpStatus.NOT_FOUND);
    }

    @PutMapping("/updater")
    public ResponseEntity<?> update(
            @RequestBody RegistrationEntity r) {

        RegistrationEntity existing =
                service.fetchRegistrationByemail(r.getEmail());

        if (existing == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Provider not found");

        }

        // REQUIRE OLD PASSWORD
        if (r.getOldPassword() == null ||
            r.getOldPassword().isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Old password is required");

        }

        // VERIFY OLD PASSWORD
        if (!existing.getPassword()
                .equals(r.getOldPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Wrong old password");

        }

        // PASSWORD CHANGE
        if (r.getNewPassword() != null &&
            !r.getNewPassword().isEmpty()) {

            existing.setPassword(r.getNewPassword());

        }

        // PROFILE UPDATE (allowed only after password verification)

        if (r.getProviderName() != null &&
            !r.getProviderName().isEmpty()) {

            existing.setProviderName(r.getProviderName());

        }

        if (r.getMobile() != null &&
            !r.getMobile().isEmpty()) {

            existing.setMobile(r.getMobile());

        }

        if (r.getAddress() != null &&
            !r.getAddress().isEmpty()) {

            existing.setAddress(r.getAddress());

        }

        if (r.getCity() != null &&
            !r.getCity().isEmpty()) {

            existing.setCity(r.getCity());

        }

        if (r.getState() != null &&
            !r.getState().isEmpty()) {

            existing.setState(r.getState());

        }

        if (r.getPincode() != null &&
            !r.getPincode().isEmpty()) {

            existing.setPincode(r.getPincode());

        }

        RegistrationEntity updated =
                service.updateRegistration(existing);

        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/deleter/{email}")
    public ResponseEntity<?> delete(@PathVariable String email) {
        RegistrationEntity r = service.fetchRegistrationByemail(email);
        if (r != null) {
            service.deleteRegistration(email);
            return ResponseEntity.ok("Deleted");
        } else
            return new ResponseEntity<>("Data not Found", HttpStatus.NOT_FOUND);
    }
    
    @PostMapping("/provider/login")
    public RegistrationEntity login(
            @RequestBody RegistrationEntity request){

        return service.Plogin(
                request.getEmail(),
                request.getPassword());
    }
    
    
    
    

}
