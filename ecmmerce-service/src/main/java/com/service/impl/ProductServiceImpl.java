package com.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

import com.common.utils.AuthUtils;
import com.dto.productdto.ProductDetailProjection;
import com.dto.productdto.*;
import com.model.Category;
import com.model.ProductImage;
import com.model.ProductType;
import com.repository.CategoryRepository;
import com.service.ProductImageService;
import com.service.ProductTypeService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import com.model.Product;
import com.repository.ProductRepository;
import com.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private ProductTypeService productTypeService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void  saveData(ProductSaveDTO productSaveDTO) throws Exception {
        Product product = new Product();

        BeanUtils.copyProperties(productSaveDTO, product);
        product.setInitBy(AuthUtils.getCurrentUsername());
        product.setCreateDate(LocalDate.now());

        Product resultSave =  productRepository.save(product);

        if (!resultSave.getId().isEmpty()) {
            List<ProductImage> productImages = new ArrayList<>();

            if (productSaveDTO.getImages() != null && !productSaveDTO.getImages().isEmpty()) {
                boolean flag = true;
                for (MultipartFile imageFile : productSaveDTO.getImages()) {
                    ProductImage productImage = new ProductImage();

                    if (flag) {
                        productImage.setIsThumbnail(true);
                        flag = false;
                    }
                    productImage.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));
                    productImage.setProductId(resultSave.getId());
                    productImage.setInitBy(AuthUtils.getCurrentUsername());
                    productImage.setCreateDate(LocalDate.now());

                    productImages.add(productImage);
                }

                productImageService.save(productImages);
            }

            if (productSaveDTO.getProductTypes() != null && !productSaveDTO.getProductTypes().isEmpty()) {
                List<ProductType> productTypes = new ArrayList<>();

                setDataProductType(productSaveDTO, resultSave, productTypes);
            }
        }
    }

    @Override
    @Transactional
    public Page<ProductListDTO> findAllProductsWithCategoryName(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDTO> productPage = productRepository.findAllProductsWithCategoryName(pageable);
        List<ProductType> productTypes = productTypeService.findAll();

        Map<String, List<String>> productTypeMap = productTypes.stream()
                .collect(Collectors.groupingBy(ProductType::getProductId,
                        Collectors.mapping(ProductType::getName, Collectors.toList())));

        List<ProductListDTO> updatedProductList = productPage.getContent().stream().map(productListDTO -> {
            if (productListDTO.getSaleRate() > 0) {
                BigDecimal price = productListDTO.getPrice();
                BigDecimal rate = BigDecimal.valueOf(productListDTO.getSaleRate()).divide(BigDecimal.valueOf(100));
                BigDecimal newPrice = price.subtract(price.multiply(rate));
                productListDTO.setNewPrice(newPrice);
            }

            List<String> types = productTypeMap.get(productListDTO.getId());
            if (!CollectionUtils.isEmpty(types)) {
                productListDTO.setProductType(String.join(" - ", types));
            }
            return productListDTO;
        }).toList();

        return new PageImpl<>(updatedProductList, pageable, productPage.getTotalElements());
    }

    @Override
    @Transactional
    public ProductDataUpdateDTO findById(String id) {
        ProductDataUpdateDTO productDataUpdateDTO = new ProductDataUpdateDTO();

        Product productResult = productRepository.findById(id)
                .map(product -> {
                    Product temp = new Product();
                    BeanUtils.copyProperties(product, temp);
                    return temp;
                })
                .orElse(new Product());

        List<ProductType> productTypes = (productResult.getId() != null)
                ? productTypeService.findByProductId(productResult.getId())
                : Collections.emptyList();

        productDataUpdateDTO.setProduct(productResult);
        productDataUpdateDTO.setProductTypes(productTypes);

        return productDataUpdateDTO;
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(ProductSaveDTO productSaveDTO) {
        Product product = new Product();

        BeanUtils.copyProperties(productSaveDTO, product);
        product.setUpdateBy(AuthUtils.getCurrentUsername());
        product.setUpdateDate(LocalDate.now());

        Product resultSave =  productRepository.save(product);

        if (!resultSave.getId().isEmpty()) {
            if (productSaveDTO.getProductTypes() != null && !productSaveDTO.getProductTypes().isEmpty()) {
                List<ProductType> productTypes = new ArrayList<>();

                List<ProductType> productTypesByProductId = productTypeService.findByProductId(resultSave.getId());
                productTypeService.deleteAll(productTypesByProductId);

                setDataProductType(productSaveDTO, resultSave, productTypes);
            }
        }
    }

    private void setDataProductType(ProductSaveDTO productSaveDTO, Product resultSave, List<ProductType> productTypes) {
        for (String productType : productSaveDTO.getProductTypes()) {
            ProductType productTypeData = new ProductType();
            productTypeData.setName(productType);
            productTypeData.setInitBy(AuthUtils.getCurrentUsername());
            productTypeData.setCreateDate(LocalDate.now());
            productTypeData.setProductId(resultSave.getId());

            productTypes.add(productTypeData);
        }

        productTypeService.save(productTypes);
    }

    @Override
    public void deleteById(String id) {
        productRepository.deleteById(id);
        productImageService.deleteByProductId(id);
        List<ProductType> productTypesByProductId = productTypeService.findByProductId(id);
        productTypeService.deleteAll(productTypesByProductId);
    }

    @Override
    @Transactional
    public List<ProductGroupByCategoryDTO> findPopularRecipe() {
        List<ProductGroupByCategoryDTO> productGroupByCategoryDTOS = new ArrayList<>();

        List<Category> categories = categoryRepository.findByParentIsNullOrderByPositionAsc();

        for (Category category : categories) {
            List<Category> categoriesGroup = categoryRepository.findByParent_IdOrderByPositionAsc(category.getId());

            if (CollectionUtils.isEmpty(categoriesGroup)) {
                continue;
            }

            List<PopularRecipeDTO> popularRecipeDTOS = new ArrayList<>();
            ProductGroupByCategoryDTO productGroupByCategoryDTO = new ProductGroupByCategoryDTO();

            setProductByCategoryGroup(category, categoriesGroup, popularRecipeDTOS, productGroupByCategoryDTO);
            if (!CollectionUtils.isEmpty(productGroupByCategoryDTO.getPopularRecipeDTOS().get(0).getProductPopularDTOS())) {
                productGroupByCategoryDTOS.add(productGroupByCategoryDTO);
            }
        }

        return productGroupByCategoryDTOS;
    }

    private void setProductByCategoryGroup(Category category, List<Category> categoriesGroup, List<PopularRecipeDTO> popularRecipeDTOS, ProductGroupByCategoryDTO productGroupByCategoryDTO) {
        for (Category categoryGroup : categoriesGroup) {
            List<Product> products = productRepository.findTop3ByCategoryIdOrderByCreateDateDesc(categoryGroup.getId());
            List<ProductPopularDTO> productPopularDTOS = new ArrayList<>();

            for (Product product : products) {
                ProductPopularDTO productPopularDTO = new ProductPopularDTO();
                BeanUtils.copyProperties(product, productPopularDTO);
                List<ProductImage> productImages  = productImageService.findByProductIdAndIsThumbnail(product.getId(), true);
                productPopularDTO.setImage(productImages.get(0).getImageData());

                if (productPopularDTO.getSaleRate() > 0) {
                    BigDecimal price = productPopularDTO.getPrice();
                    BigDecimal rate = BigDecimal.valueOf(productPopularDTO.getSaleRate()).divide(BigDecimal.valueOf(100));

                    BigDecimal newPrice =  price.subtract(price.multiply(rate));
                    productPopularDTO.setNewPrice(newPrice);
                }

                productPopularDTOS.add(productPopularDTO);
            }

            PopularRecipeDTO popularRecipeDTO = new PopularRecipeDTO();

            popularRecipeDTO.setCategoryId(categoryGroup.getId());
            popularRecipeDTO.setCategoryName(categoryGroup.getCategoryName());
            popularRecipeDTO.setCategoryColor(categoryGroup.getColor());
            popularRecipeDTO.setProductPopularDTOS(productPopularDTOS);

            popularRecipeDTOS.add(popularRecipeDTO);
        }

        productGroupByCategoryDTO.setParentId(category.getId());
        productGroupByCategoryDTO.setCategoryName(category.getCategoryName());
        productGroupByCategoryDTO.setCategoryColor(category.getColor());
        productGroupByCategoryDTO.setPopularRecipeDTOS(popularRecipeDTOS);
    }

    @Override
    @Transactional
    public ProductDetailDTO findProductDetail(String id) {
        ProductDetailDTO productDetailDTO = new ProductDetailDTO();

        Optional<Product> productOpt = productRepository.findById(id);

        if (!productOpt.isPresent()) {
            return productDetailDTO;
        }

        Product product = productOpt.get();
        BeanUtils.copyProperties(product, productDetailDTO);

        List<ProductImage> productImages = productImageService.findByProductId(product.getId());
        List<ProductImage> productImageThumbnails = productImageService.findByProductIdAndIsThumbnail(product.getId(), true);
        List<ProductType> productTypes = productTypeService.findByProductId(product.getId());

        if (!CollectionUtils.isEmpty(productImageThumbnails)) {
            productDetailDTO.setImage(productImageThumbnails.get(0).getImageData());
        }

        productDetailDTO.setProductImageList(productImages);
        productDetailDTO.setProductTypes(productTypes);

        if (product.getSaleRate() > 0) {
            BigDecimal rate = BigDecimal.valueOf(product.getSaleRate()).divide(BigDecimal.valueOf(100));
            BigDecimal newPrice = product.getPrice().subtract(product.getPrice().multiply(rate));
            productDetailDTO.setNewPrice(newPrice);
        } else {
            productDetailDTO.setNewPrice(BigDecimal.ZERO);
        }

        return productDetailDTO;
    }

    @Override
    @Transactional
    public List<ProductDetailDTO> findProductBestSale() {
        List<ProductDetailDTO> productDetailDTOS = new ArrayList<>();
        ProductDetailDTO productDetailDTO;
        List<ProductDetailProjection> productBestSase = productRepository.findProductBestSase();

        for (ProductDetailProjection productDetailProjection : productBestSase) {
            List<ProductImage> productImageThumbnails = productImageService.findByProductIdAndIsThumbnail(productDetailProjection.getId(), true);

            productDetailDTO = new ProductDetailDTO();
            productDetailDTO.setNewPrice(getNewPrice(productDetailProjection.getSaleRate(), productDetailProjection.getPrice()));
            productDetailDTO.setId(productDetailProjection.getId());
            productDetailDTO.setProductName(productDetailProjection.getProductName());
            productDetailDTO.setImage(productImageThumbnails.get(0).getImageData());
            productDetailDTO.setPrice(productDetailProjection.getPrice());
            productDetailDTO.setIsButtonContact(productDetailProjection.getIsButtonContact());
            productDetailDTO.setSaleRate(productDetailProjection.getSaleRate());
            productDetailDTOS.add(productDetailDTO);
        }
        return productDetailDTOS;
    }

    @Override
    @Transactional
    public ProductDetailDTO findProductNew() {
        return productRepository.findProductNew();
    }

    private BigDecimal getNewPrice(int saleRate, BigDecimal price){
        if (saleRate > 0) {
            BigDecimal rate = BigDecimal.valueOf(saleRate).divide(BigDecimal.valueOf(100));

            return price.subtract(price.multiply(rate));
        } else {
            return BigDecimal.valueOf(0);
        }
    }

    @Override
    @Transactional
    public Page<PopularRecipeDTO> findByCategoryIdOrderByCreateDateDesc(String categoryId, int page, int size) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);

        if (categoryOptional.isPresent()) {
            String categoryName = categoryOptional.get().getCategoryName();
            String categoryColor = categoryOptional.get().getColor();

            Pageable pageable = PageRequest.of(page, size);

            Page<Product> productPage = productRepository.findByCategoryIdOrderByCreateDateDesc(categoryId, pageable);

            List<ProductPopularDTO> productDTOs = productPage.getContent().stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            PopularRecipeDTO popularRecipeDTO = new PopularRecipeDTO(categoryId, categoryName, categoryColor, productDTOs);

            List<PopularRecipeDTO> popularRecipeDTOs = new ArrayList<>();
            popularRecipeDTOs.add(popularRecipeDTO);

            return new PageImpl<>(popularRecipeDTOs, pageable, productPage.getTotalElements());
        } else {
            return Page.empty();
        }
    }

    @Override
    @Transactional
    public ProductGroupByCategoryDTO findByIdAndParentIsNull(String id) {
        Category category = categoryRepository.findByIdAndParentIsNull(id);

        ProductGroupByCategoryDTO productGroupByCategoryDTO = new ProductGroupByCategoryDTO();

        if (category != null) {
            List<Category> categoriesGroup = categoryRepository.findByParent_IdOrderByPositionAsc(category.getId());

            if (CollectionUtils.isEmpty(categoriesGroup)) {
                return productGroupByCategoryDTO;
            }

            List<PopularRecipeDTO> popularRecipeDTOS = new ArrayList<>();

            setProductByCategoryGroup(category, categoriesGroup, popularRecipeDTOS, productGroupByCategoryDTO);
        }

        return productGroupByCategoryDTO;
    }

    @Override
    @Transactional
    public Page<PopularRecipeDTO> searchProduct(String categoryId, String keyword, int page, int size) {
        List<Category> categories = new ArrayList<>();

        if ("all".equals(categoryId)) {
            categories = categoryRepository.findByParentIsNotNullOrderByPositionAsc();
        } else {
            Optional<Category> categoryOptional = categoryRepository.findById(categoryId);

            if (categoryOptional.isPresent()) {
                categories.add(categoryOptional.get());
            }
        }

        List<PopularRecipeDTO> popularRecipeDTOs = new ArrayList<>();
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = new PageImpl<>(Collections.emptyList());

        long totalPage = 1;

        for (Category category : categories) {
            String categoryName = category.getCategoryName();
            String categoryColor = category.getColor();

            productPage = productRepository.searchProduct(category.getId(), keyword, pageable);

            if (!CollectionUtils.isEmpty(productPage.getContent())) {
                List<ProductPopularDTO> productDTOs = productPage.getContent().stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList());

                PopularRecipeDTO popularRecipeDTO = new PopularRecipeDTO(categoryId, categoryName, categoryColor, productDTOs);

                popularRecipeDTOs.add(popularRecipeDTO);

                if (productPage.getTotalElements() > totalPage) {
                    totalPage = productPage.getTotalElements();
                }
            }
        }

        return new PageImpl<>(popularRecipeDTOs, pageable, totalPage);
    }

    private ProductPopularDTO convertToDTO(Product product) {
        List<ProductImage> productImages = productImageService.findByProductIdAndIsThumbnail(product.getId(), true);
        String image = null;
        if (!productImages.isEmpty()) {
            image = productImages.get(0).getImageData();
        }

        BigDecimal newPrice = BigDecimal.valueOf(0);
        if (product.getSaleRate() > 0) {
            BigDecimal price = product.getPrice();
            BigDecimal rate = BigDecimal.valueOf(product.getSaleRate()).divide(BigDecimal.valueOf(100));
            newPrice = price.subtract(price.multiply(rate));
        }

        return new ProductPopularDTO(
                product.getId(),
                product.getProductName(),
                product.getProductInfo(),
                product.getDescription(),
                image,
                product.getPrice(),
                newPrice,
                product.getIsButtonContact(),
                product.getSaleRate(),
                product.getCategoryId()
        );
    }
}
