package com.edu.info.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.edu.info.entity.Category;
import com.edu.info.repository.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository catrepo;

    @Override
    public Category saveCategory(Category category) {
        return catrepo.save(category);
    }

    @Override
    public List<Category> fetchAllCategories() {
        return catrepo.findAll();
    }

	@Override
	public Category fetchCategoryByCid(int cid) {
		return catrepo.findById(cid).orElse(null);
		
		
	}
	@Override
	public Category UpdateByCid(Category cid) {
		return catrepo.save(cid);
		
		
	}
	@Override
	public void deleteByCid(int cid) {
	    catrepo.deleteById(cid); 
	}

		
	}

