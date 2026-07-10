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
public class CartProductOrderDTO {
    private String fullName;
    private String phone;
    private String address;
    private BigDecimal deliveryPrice;
    private BigDecimal cartTotalPrice;
    private int cartTotalQuantity;
    private String note;
    private BigDecimal paymentAmount;
    private List<CartProduct> cartProducts;
}
