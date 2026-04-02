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
import com.edu.info.entity.ServiceEntity;
import com.edu.info.service.RegistrationService;
import com.edu.info.service.ServiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
@CrossOrigin("*")
@RestController
public class ServiceController {
	@Autowired
	private ServiceService service;
	@PostMapping("addS")
	public ServiceEntity add(@RequestBody ServiceEntity s) {
		return service.saveService(s);
	}
	 @GetMapping("/fetchs")
	 public List<ServiceEntity> fetchAll() {
	      return service.fetchAllServices();
	    }
	 
	   @Operation(summary = "search Service by ID", description = "Search a  Service by ID")
	    @ApiResponses(value = {
	        @ApiResponse(responseCode = "200", 
	            description=" search Registration"),
	        @ApiResponse(
	            responseCode = "400", 
	            description="Invalid Request"  
	            )
	        
	    })
	    @GetMapping("/fetchs/{id}")
	    public ResponseEntity<?> fetchById(@PathVariable int id) {
	        ServiceEntity s = service.fetchServiceById(id);
	        if (s != null)
	            return ResponseEntity.ok(s);
	        else
	            return new ResponseEntity<>("Data not Found", HttpStatus.NOT_FOUND);
	    }
	  
	    @PutMapping("/updates")
	    public ResponseEntity<?> update(@RequestBody ServiceEntity s) {
	        ServiceEntity existing = service.fetchServiceById(s.getServiceId());
	        if (existing != null)
	            return ResponseEntity.ok(service.updateService(s));
	        else
	            return new ResponseEntity<>("Data not Found", HttpStatus.NOT_FOUND);
	    }
	    @Operation(summary = "Delete a  Service", description = "Delete a  Service to the system")
	    @ApiResponses(value = {
	        @ApiResponse(responseCode = "200", 
	            description="Service deleted"),
	        @ApiResponse(
	            responseCode = "400", 
	            description="Invalid Request"  
	            )
	        
	    })
	    @DeleteMapping("/deletes/{id}")
	    public ResponseEntity<?> delete(@PathVariable int id) {
	        ServiceEntity s = service.fetchServiceById(id);
	        if (s != null) {
	            service.deleteService(id);
	            return ResponseEntity.ok("Deleted");
	        } else
	            return new ResponseEntity<>("Data not Found", HttpStatus.NOT_FOUND);
	    }
	    @GetMapping("/services/category/{cid}")
	    public List<ServiceEntity> getServicesByCategory(@PathVariable int cid) {
	        return service.fetchServicesByCid(cid);
	    }
	    @GetMapping("/services/byid/{sid}")
	    public String getServicesByName(@PathVariable int sid) {
	        return service.fetchServiceNameById(sid);
	    }
	    

}
