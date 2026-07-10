package com.service.impl;

import com.common.utils.AuthUtils;
import com.dto.banner.BannerDTO;
import com.dto.productdto.ProductImageUpdateDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.ProductImage;
import com.repository.ProductImageRepository;
import com.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    public void save(List<ProductImage> productImages) {
        productImageRepository.saveAll(productImages);
    }

    @Override
    @Transactional
    public List<ProductImage> findByProductId(String productId) {
        return productImageRepository.findByProductId(productId);
    }

    @Override
    @Transactional
    public void update(ProductImageUpdateDTO productImageUpdateDTO) throws Exception {
        List<ProductImage> productImageList = new ArrayList<>();

        String productId = productImageUpdateDTO.getProductId();
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> existingImages = objectMapper.readValue(productImageUpdateDTO.getExistingImages(),
                new TypeReference<>() {});

        List<ProductImage> oldImages = productImageRepository.findByProductId(productImageUpdateDTO.getProductId());
        List<String> deleteIds = new ArrayList<>();
        List<ProductImage> oldImagesSave = new ArrayList<>();
        boolean flag = true;

        if (existingImages.isEmpty()) {
            productImageRepository.deleteByProductId(productId);
        } else if (!CollectionUtils.isEmpty(oldImages)) {
            String idImage = "";

            for (ProductImage productImage : oldImages) {
                if (flag) {
                    productImage.setIsThumbnail(true);
                    flag = false;
                } else {
                    productImage.setIsThumbnail(false);
                }
                oldImagesSave.add(productImage);
                idImage = productImage.getId();

                if (!existingImages.contains(idImage)) {
                    deleteIds.add(idImage);
                }
             }
            productImageRepository.saveAll(oldImagesSave);
            productImageRepository.deleteByIdIn(deleteIds);
        }

        if (productImageUpdateDTO.getImages() != null && !productImageUpdateDTO.getImages().isEmpty()) {

            for (MultipartFile imageFile : productImageUpdateDTO.getImages()) {
                ProductImage productImage = new ProductImage();
                if (flag) {
                    productImage.setIsThumbnail(true);
                    flag = false;
                } else {
                    productImage.setIsThumbnail(false);
                }

                productImage.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));
                productImage.setProductId(productId);
                productImage.setInitBy(AuthUtils.getCurrentUsername());
                productImage.setCreateDate(LocalDate.now());

                productImageList.add(productImage);
            }

            productImageRepository.saveAll(productImageList);
        }
    }

    @Override
    @Transactional
    public void deleteByProductId(String productId) {
        productImageRepository.deleteByProductId(productId);
    }

    @Override
    @Transactional
    public List<ProductImage> findByProductIdAndIsThumbnail(String productId, Boolean isThumbnail) {
        return productImageRepository.findByProductIdAndIsThumbnail(productId, isThumbnail);
    }

    @Override
    @Transactional
    public List<BannerDTO> getBannerList() {
        List<ProductImage> productImages = productImageRepository.findByIsBanner(true);

        if (CollectionUtils.isEmpty(productImages)) {
            return new ArrayList<>();
        }

        return productImages.stream()
                .map(productImage -> new BannerDTO(
                        productImage.getId(),
                        productImage.getImageData()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateBanner(ProductImageUpdateDTO productImageUpdateDTO) throws Exception {
        List<ProductImage> productImageList = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> existingImages = objectMapper.readValue(productImageUpdateDTO.getExistingImages(), new TypeReference<>() {});
        List<ProductImage> oldImages = productImageRepository.findByIsBanner(true);
        List<String> deleteIds = new ArrayList<>();
        if (existingImages.isEmpty()) {
            productImageRepository.deleteByIsBanner(true);
        } else if (!CollectionUtils.isEmpty(oldImages)) {
            String idImage = "";

            for (ProductImage productImage : oldImages) {
                idImage = productImage.getId();

                if (!existingImages.contains(idImage)) {
                    deleteIds.add(idImage);
                }
            }
            productImageRepository.deleteByIdIn(deleteIds);
        }

        if (productImageUpdateDTO.getImages() != null && !productImageUpdateDTO.getImages().isEmpty()) {
            for (MultipartFile imageFile : productImageUpdateDTO.getImages()) {
                ProductImage productImage = new ProductImage();

                productImage.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));
                productImage.setIsBanner(true);
                productImage.setInitBy(AuthUtils.getCurrentUsername());
                productImage.setCreateDate(LocalDate.now());

                productImageList.add(productImage);
            }

            productImageRepository.saveAll(productImageList);
        }
    }

}