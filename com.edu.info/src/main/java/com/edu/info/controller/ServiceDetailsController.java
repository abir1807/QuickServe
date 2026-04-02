package com.edu.info.controller;

import com.edu.info.entity.RegistrationEntity;
import com.edu.info.entity.ServiceDetailsEntity;
import com.edu.info.repository.RegistrationRepository;
import com.edu.info.repository.ServiceDetailsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/provider")
@CrossOrigin("*")
public class ServiceDetailsController {

    @Autowired
    private ServiceDetailsRepository repo;
    @Autowired
    private RegistrationRepository registrationRepo;
    // ADD SERVICE
    @PostMapping(value="/addService", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String addService(

            @RequestParam String providerEmail,
            @RequestParam Integer serviceId,
            @RequestParam String description,
            @RequestParam String location,
            @RequestParam String workingStart,
            @RequestParam String workingEnd,
            @RequestParam String workingDays,
            @RequestParam String serviceCharge,
            @RequestParam("images") MultipartFile[] images

    ) {

        try {

            // ⚡ SAVE TO REACT ASSETS FOLDER
            String uploadDir =
            "E:/Fsp_Project/Frontend_SBA/sbapp/public/assets/services/";

            File folder = new File(uploadDir);
            if(!folder.exists()){
                folder.mkdirs();
            }

            String image1 = null;
            String image2 = null;

            // IMAGE 1
            if(images.length > 0){

                MultipartFile img1 = images[0];

                String fileName1 =
                        System.currentTimeMillis() + "_" + img1.getOriginalFilename();

                img1.transferTo(new File(uploadDir + fileName1));

                image1 = fileName1;
            }

            // IMAGE 2
            if(images.length > 1){

                MultipartFile img2 = images[1];

                String fileName2 =
                        System.currentTimeMillis() + "_" + img2.getOriginalFilename();

                img2.transferTo(new File(uploadDir + fileName2));

                image2 = fileName2;
            }

            ServiceDetailsEntity service = new ServiceDetailsEntity();

            service.setProviderEmail(providerEmail);
            service.setServiceId(serviceId);
            service.setDescription(description);
            service.setLocation(location);
            service.setWorkingStart(workingStart);
            service.setWorkingEnd(workingEnd);
            service.setWorkingDays(workingDays);

            service.setServiceCharge(Double.parseDouble(serviceCharge));

            service.setImage1(image1);
            service.setImage2(image2);

            repo.save(service);

            return "Service Saved Successfully";

        } catch (Exception e) {

            e.printStackTrace();
            return "Error saving service";

        }

    }
    

    // GET PROVIDER SERVICES
    @GetMapping("/services/{email}")
    public java.util.List<ServiceDetailsEntity> getServicesByProvider(
            @PathVariable String email) {

        return repo.findByProviderEmail(email);
    }
    
    @DeleteMapping("/deleteService/{id}")
    public String deleteService(@PathVariable Integer id) {

        try {

            repo.deleteById(id);

            return "Service Deleted";

        } catch(Exception e){

            e.printStackTrace();
            return "Delete Failed";

        }

    }
 // ✅ ADD THIS at top of ServiceDetailsController
    

    @GetMapping("/providers/{serviceId}")
    public List<ServiceDetailsEntity> getProvidersByService(
            @PathVariable Integer serviceId) {

        List<ServiceDetailsEntity> all =
            repo.findByServiceId(serviceId);

        return all.stream()
            .filter(s -> {
                // ✅ Check 1 — Provider must be verified
                RegistrationEntity provider =
                    registrationRepo.findById(s.getProviderEmail())
                    .orElse(null);
                if (provider == null || !provider.isVerified()) return false;

                // ✅ Check 2 — Service must be approved
                return "APPROVED".equals(s.getStatus());
            })
            .collect(java.util.stream.Collectors.toList());
    }
    @GetMapping("/serviceDetails/{id}")
    public ServiceDetailsEntity getById(@PathVariable Integer id) {
        return repo.findById(id).orElse(null);
    }
    

}