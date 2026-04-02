package com.edu.info.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;   // ✅ ADD THIS
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
public class RegistrationEntity {

    @Id
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Provider name is required")
    private String providerName;

    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be 10 digits")
    private String mobile;

    @NotBlank(message = "Password is required")
    private String password;


    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "city is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "pincode is required")
    private String pincode;

    // ✅ TEMPORARY FIELD (NOT SAVED IN DATABASE)
    @Transient
    private String oldPassword;

    // ✅ TEMPORARY FIELD (NOT SAVED IN DATABASE)
    @Transient
    private String newPassword;

    @Column(unique = true, nullable = false)
    private String registrationNumber;
    
    @Column(nullable = false)
    private boolean isVerified = false;

    public RegistrationEntity() {}

    // getters setters

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
   

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
	@Override
	public String toString() {
		return "RegistrationEntity [email=" + email + ", providerName=" + providerName + ", mobile=" + mobile
				+ ", password=" + password + ",  address=" + address + ", city=" + city
				+ ", state=" + state + ", pincode=" + pincode + ", oldPassword=" + oldPassword + ", newPassword="
				+ newPassword + ", registrationNumber=" + registrationNumber + "]";
	}
    
    
}