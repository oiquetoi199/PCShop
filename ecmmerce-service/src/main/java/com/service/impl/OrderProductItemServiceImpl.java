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

    /** Kiểm tra và lưu chi tiết đơn hàng vào cơ sở dữ liệu. */
    @Override
    public void save(List<OrderProductItem> orderProductItems) {
        orderProductItemRepository.saveAll(orderProductItems);
    }

    /** Tìm danh sách chi tiết sản phẩm theo mã đơn hàng. */
    @Override
    public List<OrderProductItem> findByOrderProductId(String orderProductId) {
        return orderProductItemRepository.findByOrderProductId(orderProductId);
    }
}
