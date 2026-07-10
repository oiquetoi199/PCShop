package com.service.impl;

import com.model.ProductType;
import com.repository.ProductTypeRepository;
import com.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductTypeServiceImpl implements ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Override
    public void save(List<ProductType> productTypes) {
        productTypeRepository.saveAll(productTypes);
    }

    @Override
    public List<ProductType> findAll() {
        return productTypeRepository.findAll();
    }

    @Override
    public List<ProductType> findByProductId(String id) {
        return productTypeRepository.findByProductId(id);
    }

    @Override
    public void deleteAll(List<ProductType> productTypes) {
        productTypeRepository.deleteAll(productTypes);
    }
}
