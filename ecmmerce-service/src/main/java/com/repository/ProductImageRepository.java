package com.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.model.ProductImage;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, String> {
    @Transactional
    List<ProductImage> findByProductId(String productId);
    @Transactional
    void deleteByProductId(String productId);
    @Transactional
    void deleteByIdIn(List<String> listIds);
    @Transactional
    void deleteByIsBanner(Boolean isBanner);
    @Transactional
    List<ProductImage> findByProductIdAndIsThumbnail(String productId, Boolean isThumbnail);
    @Transactional
    List<ProductImage> findByIsBanner(Boolean isBanner);

}
