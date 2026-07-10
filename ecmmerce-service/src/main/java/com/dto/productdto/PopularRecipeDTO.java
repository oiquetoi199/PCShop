package com.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PopularRecipeDTO {
    private String categoryId;
    private String categoryName;
    private String categoryColor;
    private List<ProductPopularDTO> productPopularDTOS;
}
