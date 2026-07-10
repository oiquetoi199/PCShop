package com.controller;

import com.dto.productdto.*;
import com.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.common.utils.StringStatic;
import com.response.MessageResponse;
import com.service.ProductService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductImageService productImageService;

    @PostMapping("/save")
    public ResponseEntity<MessageResponse> save(@ModelAttribute ProductSaveDTO productSaveDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            productService.saveData(productSaveDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            e.printStackTrace();
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @GetMapping("/find-all")
    public ResponseEntity<Page<ProductListDTO>> findAll(@RequestParam int page,
                                                        @RequestParam int size) {
        return ResponseEntity.ok().body(productService.findAllProductsWithCategoryName(page, size));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ProductDataUpdateDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(productService.findById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<MessageResponse> updateProduct(@ModelAttribute ProductSaveDTO productSaveDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            productService.updateProduct(productSaveDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            productService.deleteById(id);

            messageResponse.setMessage(StringStatic.SUCCESS);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    @GetMapping("/guest/popular-recipe")
    public ResponseEntity<List<ProductGroupByCategoryDTO>> findPopularRecipe() {
        return ResponseEntity.ok().body(productService.findPopularRecipe());
    }

    @GetMapping("/guest/product-detail/{id}")
    public ResponseEntity<ProductDetailDTO> findProductDetail(@PathVariable String id) {
        return ResponseEntity.ok().body(productService.findProductDetail(id));
    }

    @GetMapping("/guest/product-best-sale")
    public ResponseEntity<List<ProductDetailDTO>> findProductBestSale() {
        return ResponseEntity.ok().body(productService.findProductBestSale());
    }

    @GetMapping("/guest/product-new")
    public ResponseEntity<ProductDetailDTO> findProductNew() {
        return ResponseEntity.ok().body(productService.findProductNew());
    }

    @GetMapping("/guest/products/{id}")
    public Page<PopularRecipeDTO> findByCategoryIdOrderByCreateDateDesc(@PathVariable String id,
                                                         @RequestParam int page,
                                                         @RequestParam int size) {
        return productService.findByCategoryIdOrderByCreateDateDesc(id, page, size);
    }

    @GetMapping("/guest/search")
    public Page<PopularRecipeDTO> findAllByKeyword(@RequestParam String keyword,
                                                   @RequestParam String categoryId,
                                                                        @RequestParam int page,
                                                                        @RequestParam int size) {
        return productService.searchProduct(categoryId, keyword, page, size);
    }

    @GetMapping("/guest/popular-recipe-category/{id}")
    public ResponseEntity<ProductGroupByCategoryDTO> findPopularRecipeByCategory(@PathVariable String id) {
        return ResponseEntity.ok().body(productService.findByIdAndParentIsNull(id));
    }
}
