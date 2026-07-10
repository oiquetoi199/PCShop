package com.service;


import com.dto.cart.CartProductOrderDTO;
import com.dto.orderproduct.OrderProductDTO;
import com.model.OrderProduct;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderProductService {
    void save(CartProductOrderDTO cartProductOrderDTO);

    Page<OrderProductDTO> findAll(int page, int size);

    Page<OrderProductDTO> findByUsername(int page, int size);

    OrderProductDTO findById(String id);

    OrderProductDTO findByUsernameAndId(String id);

    void deleteById(String id);

    void updateStatus(String id, int status);
}
