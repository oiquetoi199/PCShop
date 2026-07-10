package com.repository;

import com.model.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartProductRepository extends JpaRepository<CartProduct, String> {
    List<CartProduct> findByUsernameOrderByCreateDateTimeDesc(String username);

    Optional<CartProduct> findByProductNameAndProductTypeAndProductIdAndUsername(
            String productName,
            String productType,
            String productId,
            String username
    );
}
