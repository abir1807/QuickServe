package com.edu.info.service;

import java.util.List;

import com.edu.info.entity.Category;

public interface CategoryService {
	Category saveCategory(Category category);
	List<Category> fetchAllCategories();
	Category fetchCategoryByCid(int cid);
	Category UpdateByCid(Category c1);
	
	void deleteByCid(int cid);
	
}
