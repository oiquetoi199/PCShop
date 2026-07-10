package com.service;

import com.dto.cart.CartProductDTO;
import com.model.CartProduct;

import java.util.List;

public interface CartProductService {
    void save(CartProduct cartProduct);

    CartProductDTO findByUsername();

    void update(String id, int quantity);

    void delete(String id);

    void deleteAll(List<CartProduct> cartProducts);
}
