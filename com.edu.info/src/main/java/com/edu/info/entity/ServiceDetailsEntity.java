package com.edu.info.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "servicedetails")
public class ServiceDetailsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String providerEmail;

    @Column(nullable = false)
    private Integer serviceId;

    @Column(length = 500)
    private String description;

    private String location;

    private String workingStart;

    private String workingEnd;

    private String workingDays;

    private Double serviceCharge;

    // ✅ NEW IMAGE FIELDS
    private String image1;

    private String image2;
    
    @Column(nullable = false)
    private String status = "PENDING";
    // Default constructor
    public ServiceDetailsEntity() {}

    // Parameterized constructor
    public ServiceDetailsEntity(Integer id,
                                String providerEmail,
                                Integer serviceId,
                                String description,
                                String location,
                                String workingStart,
                                String workingEnd,
                                String workingDays,
                                Double serviceCharge,
                                String image1,
                                String image2) {

        this.id = id;
        this.providerEmail = providerEmail;
        this.serviceId = serviceId;
        this.description = description;
        this.location = location;
        this.workingStart = workingStart;
        this.workingEnd = workingEnd;
        this.workingDays = workingDays;
        this.serviceCharge = serviceCharge;
        this.image1 = image1;
        this.image2 = image2;
    }

    // GETTERS & SETTERS

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getProviderEmail() {
        return providerEmail;
    }

    public void setProviderEmail(String providerEmail) {
        this.providerEmail = providerEmail;
    }

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWorkingStart() {
        return workingStart;
    }

    public void setWorkingStart(String workingStart) {
        this.workingStart = workingStart;
    }

    public String getWorkingEnd() {
        return workingEnd;
    }

    public void setWorkingEnd(String workingEnd) {
        this.workingEnd = workingEnd;
    }

    public String getWorkingDays() {
        return workingDays;
    }

    public void setWorkingDays(String workingDays) {
        this.workingDays = workingDays;
    }

    public Double getServiceCharge() {
        return serviceCharge;
    }

    public void setServiceCharge(Double serviceCharge) {
        this.serviceCharge = serviceCharge;
    }

    public String getImage1() {
        return image1;
    }

    public void setImage1(String image1) {
        this.image1 = image1;
    }

    public String getImage2() {
        return image2;
    }

    public void setImage2(String image2) {
        this.image2 = image2;
    }
    

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "ServiceDetailsEntity {" +
                "id=" + id +
                ", providerEmail='" + providerEmail + '\'' +
                ", serviceId=" + serviceId +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", workingStart='" + workingStart + '\'' +
                ", workingEnd='" + workingEnd + '\'' +
                ", workingDays='" + workingDays + '\'' +
                ", serviceCharge=" + serviceCharge +
                ", image1='" + image1 + '\'' +
                ", image2='" + image2 + '\'' +
                '}';
    }
}