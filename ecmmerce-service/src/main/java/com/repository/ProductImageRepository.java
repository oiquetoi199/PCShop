package com.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.model.ProductImage;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, String> {
    /** Tìm danh sách hình ảnh sản phẩm theo mã sản phẩm. */
    @Transactional
    List<ProductImage> findByProductId(String productId);
    /** Xóa hình ảnh sản phẩm theo mã sản phẩm. */
    @Transactional
    void deleteByProductId(String productId);
    /** Xóa nhiều hình ảnh sản phẩm có mã nằm trong danh sách được cung cấp. */
    @Transactional
    void deleteByIdIn(List<String> listIds);
    /** Xóa các hình ảnh đang được đánh dấu là banner. */
    @Transactional
    void deleteByIsBanner(Boolean isBanner);
    /** Tìm ảnh đại diện của sản phẩm theo mã sản phẩm. */
    @Transactional
    List<ProductImage> findByProductIdAndIsThumbnail(String productId, Boolean isThumbnail);
    /** Lấy danh sách hình ảnh đang được sử dụng làm banner. */
    @Transactional
    List<ProductImage> findByIsBanner(Boolean isBanner);

}
