package com.controller;

import com.dto.productdto.ProductGroupByCategoryDTO;
import com.model.ProductType;
import com.service.ProductTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/product-type")
public class ProductTypeController {

    @Autowired
    private ProductTypeService productTypeService;

//    @GetMapping("/find-product-id/{id}")
//    public ResponseEntity<List<ProductType>> findByProductId(@PathVariable String id) {
//        return ResponseEntity.ok().body(productTypeService.findByProductId(id));
//    }
}
