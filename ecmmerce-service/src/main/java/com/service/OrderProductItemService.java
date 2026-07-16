package com.service;

import com.model.OrderProductItem;

import java.util.List;

public interface OrderProductItemService {
    /** Kiểm tra và lưu chi tiết đơn hàng vào cơ sở dữ liệu. */
    void save(List<OrderProductItem> orderProductItems);

    /** Tìm danh sách chi tiết sản phẩm theo mã đơn hàng. */
    List<OrderProductItem> findByOrderProductId(String orderProductId);
}
