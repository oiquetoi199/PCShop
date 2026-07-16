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

    /** Kiểm tra và lưu loại sản phẩm vào cơ sở dữ liệu. */
    @Override
    public void save(List<ProductType> productTypes) {
        productTypeRepository.saveAll(productTypes);
    }

    /** Lấy danh sách loại sản phẩm. */
    @Override
    public List<ProductType> findAll() {
        return productTypeRepository.findAll();
    }

    /** Tìm danh sách loại sản phẩm theo mã sản phẩm. */
    @Override
    public List<ProductType> findByProductId(String id) {
        return productTypeRepository.findByProductId(id);
    }

    /** Xóa toàn bộ danh sách loại sản phẩm được truyền vào. */
    @Override
    public void deleteAll(List<ProductType> productTypes) {
        productTypeRepository.deleteAll(productTypes);
    }
}
