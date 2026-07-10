package com.repository;

import com.model.OrderProductItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderProductItemRepository extends JpaRepository<OrderProductItem, String> {

    List<OrderProductItem> findByOrderProductId(String orderProductId);
}
