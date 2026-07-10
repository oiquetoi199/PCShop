package com.dto.productdto;

import com.model.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductPopularDTO {
    private String id;
    private String productName;
    private String productInfo;
    private String description;
    private String image;
    private BigDecimal price;
    private BigDecimal newPrice;
    private String isButtonContact;
    private int saleRate;
    private String categoryId;
}
