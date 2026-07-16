package com.repository;

import com.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartProductRepository extends JpaRepository<CartProduct, String> {
    /** Lấy đơn hàng của người dùng và sắp xếp từ mới đến cũ. */
    List<CartProduct> findByUsernameOrderByCreateDateTimeDesc(String username);

    /** Tìm sản phẩm trong giỏ hàng theo sản phẩm, loại sản phẩm và người dùng để tránh tạo bản ghi trùng. */
    Optional<CartProduct> findByProductNameAndProductTypeAndProductIdAndUsername(
            String productName,
            String productType,
            String productId,
            String username
    );
}
