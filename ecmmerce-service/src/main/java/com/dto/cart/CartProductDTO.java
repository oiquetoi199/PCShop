package com.dto.cart;

import com.model.CartProduct;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartProductDTO {
    private List<CartProduct> cartProducts;
    private int cartTotalQuantity;
    private BigDecimal cartTotalPrice;
}
