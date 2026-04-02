package com.edu.info.service;

import java.util.List;

import com.edu.info.entity.ServiceEntity;

public interface ServiceService {

	ServiceEntity saveService(ServiceEntity s);

	List<ServiceEntity> fetchAllServices();

	ServiceEntity updateService(ServiceEntity s);

	ServiceEntity fetchServiceById(int serviceId);
	String fetchServiceNameById(int serviceId);

	void deleteService(int serviceId);
	List<ServiceEntity> fetchServicesByCid(int cid);
}
