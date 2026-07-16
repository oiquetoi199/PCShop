package com.service;

import com.model.ProductType;

import java.util.List;

public interface ProductTypeService {
    /** Kiểm tra và lưu loại sản phẩm vào cơ sở dữ liệu. */
    void save(List<ProductType> productTypes);

    /** Lấy danh sách loại sản phẩm. */
    List<ProductType> findAll();

    /** Tìm danh sách loại sản phẩm theo mã sản phẩm. */
    List<ProductType> findByProductId(String id);

    /** Xóa toàn bộ danh sách loại sản phẩm được truyền vào. */
    void deleteAll(List<ProductType> productTypes);
}
