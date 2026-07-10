package com.dto.productdto;

import com.model.Product;
import com.model.ProductType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDataUpdateDTO {
    private Product product;
    private List<ProductType> productTypes;
}
