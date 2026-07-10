package com.service;

import com.model.OrderProductItem;

import java.util.List;

public interface OrderProductItemService {
    void save(List<OrderProductItem> orderProductItems);

    List<OrderProductItem> findByOrderProductId(String orderProductId);
}
