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

import com.edu.info.entity.Category;
import com.edu.info.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
@CrossOrigin("*")
@RequestMapping("api")
@RestController
@Tag(name="Category Management", description="API for category")
public class CategoryController {

	@Autowired
	private CategoryService catservice;
	
    @Operation(summary = "Create a new Category", description = "Add a new category to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description="Category Created"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
	@PostMapping("/add")
	public Category savCategory(@RequestBody Category c) {
		return catservice.saveCategory(c);
	}

	@GetMapping("/hi")
	public String Welcome() {
		return "API IS WORKING";
	}


    @Operation(summary = "All category details", description = "get all categories")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description=" ur Categories"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
	@GetMapping("/fetch")
	public List<Category> getAllCategories() {
		return catservice.fetchAllCategories();
	}
    

    @Operation(summary = "search Category", description = "Search a  category by id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description=" search Category"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
	@GetMapping("/fetch/{cid}")
	public ResponseEntity<?>  getfiddetails(@PathVariable int cid)
	{
		
		Category c1=catservice.fetchCategoryByCid(cid);
		if(c1!=null) {
			return ResponseEntity.ok(c1);
		}else {
			String em="Data not Found";
			return new ResponseEntity<>(em,HttpStatus.NOT_FOUND);
		}
		
		
	}
    

    @Operation(summary = "Update  Category", description = "Update ur existing category ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description="Category Created"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
	@PutMapping("/update")
	public ResponseEntity<?>  UpdateByCid(@RequestBody Category c)
	{
		
		Category c1=catservice.fetchCategoryByCid(c.getCid());
		if(c1!=null) {
			Category c2=catservice.UpdateByCid(c);
			return ResponseEntity.ok(c2);
		}else {
			String em="Data not Found";
			return new ResponseEntity<>(em,HttpStatus.NOT_FOUND);
		}
		
		
	}
    
    

    @Operation(summary = "Delete a  Category", description = "Delete a  category to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", 
            description="Category deleted"),
        @ApiResponse(
            responseCode = "400", 
            description="Invalid Request"  
            )
        
    })
	@DeleteMapping("/delete/{cid}")
	public ResponseEntity<?> deleteByCid(@PathVariable int cid) {

	    Category c1 = catservice.fetchCategoryByCid(cid);

	    if (c1 != null) {
	        catservice.deleteByCid(cid);
	        return ResponseEntity.ok("deleted");
	    } else {
	        String em = "Data not Found";
	        return new ResponseEntity<>(em, HttpStatus.NOT_FOUND);
	    }
	}

}
