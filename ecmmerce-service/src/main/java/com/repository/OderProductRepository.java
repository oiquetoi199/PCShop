package com.repository;

import com.model.OrderProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OderProductRepository extends JpaRepository<OrderProduct, String> {
    /** Tìm oder sản phẩm theo tên đăng nhập được cung cấp. */
    Page<OrderProduct> findByUsername(String username, Pageable pageable);

    /** Tìm oder sản phẩm theo người dùng hiện tại và mã định danh. */
    OrderProduct findByUsernameAndId(String username, String id);
}
