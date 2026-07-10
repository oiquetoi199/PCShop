package com.repository;

import com.model.OrderProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OderProductRepository extends JpaRepository<OrderProduct, String> {
    Page<OrderProduct> findByUsername(String username, Pageable pageable);

    OrderProduct findByUsernameAndId(String username, String id);
}
