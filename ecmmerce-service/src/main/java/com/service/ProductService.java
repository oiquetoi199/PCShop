package com.service;

import com.dto.productdto.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface  ProductService {
    void saveData(ProductSaveDTO productSaveDTO) throws Exception;

    Page<ProductListDTO> findAllProductsWithCategoryName(int page, int size);

    ProductDataUpdateDTO findById(String id);

    void updateProduct(ProductSaveDTO productSaveDTO);

    void deleteById(String id);

    List<ProductGroupByCategoryDTO> findPopularRecipe();

    ProductDetailDTO findProductDetail(String id);

    List<ProductDetailDTO> findProductBestSale();
    ProductDetailDTO findProductNew();

    Page<PopularRecipeDTO> findByCategoryIdOrderByCreateDateDesc(String categoryId, int page, int size);

    ProductGroupByCategoryDTO findByIdAndParentIsNull(String id);

    Page<PopularRecipeDTO> searchProduct(String categoryId, String keyword, int page, int size);
}
