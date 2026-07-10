package com.service.impl;

import com.model.OrderProductItem;
import com.repository.OrderProductItemRepository;
import com.service.OrderProductItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderProductItemServiceImpl implements OrderProductItemService {
    @Autowired
    private OrderProductItemRepository orderProductItemRepository;

    @Override
    public void save(List<OrderProductItem> orderProductItems) {
        orderProductItemRepository.saveAll(orderProductItems);
    }

    @Override
    public List<OrderProductItem> findByOrderProductId(String orderProductId) {
        return orderProductItemRepository.findByOrderProductId(orderProductId);
    }
}
