package com.edu.info.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edu.info.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

}
