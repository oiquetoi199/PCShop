package com.repository;

import com.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, String> {
    /** Tìm danh sách loại sản phẩm theo mã sản phẩm. */
    List<ProductType> findByProductId(String id);
}
