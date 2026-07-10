package com.service;

import com.model.ProductType;

import java.util.List;

public interface ProductTypeService {
    void save(List<ProductType> productTypes);

    List<ProductType> findAll();

    List<ProductType> findByProductId(String id);

    void deleteAll(List<ProductType> productTypes);
}
