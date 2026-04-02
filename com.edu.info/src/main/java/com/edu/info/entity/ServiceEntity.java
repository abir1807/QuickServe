

package com.edu.info.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class ServiceEntity {
	@Id
	 private int serviceId;
	 private String serviceName;
	 private String serviceType;
	 private int cid;
	 public ServiceEntity() {
		super();
		// TODO Auto-generated constructor stub
	 }
	 public ServiceEntity(int serviceId, String serviceName, String serviceType, int cid) {
		super();
		this.serviceId = serviceId;
		this.serviceName = serviceName;
		this.serviceType = serviceType;
		this.cid = cid;
	 }
	 public int getServiceId() {
		 return serviceId;
 }
 public void setServiceId(int serviceId) {
		 this.serviceId = serviceId;
	 }
	 public String getServiceName() {
		 return serviceName;
	 }
	 public void setServiceName(String serviceName) {
		 this.serviceName = serviceName;
	 }
	 public String getServiceType() {
		 return serviceType;
	 }
	 public void setServiceType(String serviceType) {
		 this.serviceType = serviceType;
	 }
	 public int getCid() {
		 return cid;
	 }
	 public void setCid(int cid) {
		 this.cid = cid;
	 }
	 @Override
	 public String toString() {
		return "Service [serviceId=" + serviceId + ", serviceName=" + serviceName + ", serviceType=" + serviceType
				+ ", cid=" + cid + "]";
	 }
	 
	 
}
