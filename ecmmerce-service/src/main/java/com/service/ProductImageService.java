package com.service;

import com.dto.banner.BannerDTO;
import com.dto.productdto.ProductImageUpdateDTO;
import com.model.ProductImage;

import java.util.List;

public interface ProductImageService {
    void save(List<ProductImage> productImages) throws Exception;

    List<ProductImage> findByProductId(String productId);

    void update(ProductImageUpdateDTO productImageUpdateDTO) throws Exception;

    void deleteByProductId(String productId);

    List<ProductImage> findByProductIdAndIsThumbnail(String productId, Boolean isThumbnail);

    List<BannerDTO> getBannerList();

    void updateBanner(ProductImageUpdateDTO productImageUpdateDTO) throws Exception;
}
