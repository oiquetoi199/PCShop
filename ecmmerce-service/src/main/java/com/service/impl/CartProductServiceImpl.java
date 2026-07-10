package com.service.impl;

import com.common.utils.AuthUtils;
import com.dto.cart.CartProductDTO;
import com.model.CartProduct;
import com.repository.CartProductRepository;
import com.service.CartProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartProductServiceImpl implements CartProductService {
    @Autowired
    private CartProductRepository cartProductRepository;

    @Override
    @Transactional
    public void save(CartProduct cartProduct) {
        Optional<CartProduct> existingCartProduct = cartProductRepository.findByProductNameAndProductTypeAndProductIdAndUsername(cartProduct.getProductName(), cartProduct.getProductType(), cartProduct.getProductId(), AuthUtils.getCurrentUsername());

        if (existingCartProduct.isPresent()) {
            CartProduct cartProductExist= existingCartProduct.get();
            cartProductExist.setQuantity(cartProductExist.getQuantity() + cartProduct.getQuantity());
            cartProductExist.setTotalPrice(cartProductExist.getTotalPrice().add(cartProduct.getTotalPrice()));
            cartProductExist.setCreateDateTime(LocalDateTime.now());

            cartProductRepository.save(cartProductExist);
        } else {
            cartProduct.setUsername(AuthUtils.getCurrentUsername());
            cartProduct.setCreateDateTime(LocalDateTime.now());
            cartProductRepository.save(cartProduct);
        }
    }

    @Override
    @Transactional
    public CartProductDTO findByUsername() {
        List<CartProduct> cartProducts = cartProductRepository.findByUsernameOrderByCreateDateTimeDesc(AuthUtils.getCurrentUsername());

        BigDecimal cartTotalPrice = cartProducts.stream()
                .map(CartProduct::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int cartTotalQuantity = cartProducts.stream()
                .mapToInt(CartProduct::getQuantity)
                .sum();

        CartProductDTO cartProductDTO = new CartProductDTO();
        cartProductDTO.setCartProducts(cartProducts);
        cartProductDTO.setCartTotalPrice(cartTotalPrice);
        cartProductDTO.setCartTotalQuantity(cartTotalQuantity);

        return cartProductDTO;
    }

    @Override
    @Transactional
    public void update(String id, int quantity) {
        Optional<CartProduct> optionalCartProduct = cartProductRepository.findById(id);

        if (optionalCartProduct.isPresent()) {
            CartProduct cartProduct = optionalCartProduct.get();

            BigDecimal newTotalPrice;

            if (cartProduct.getSaleRate() > 0) {
                newTotalPrice = cartProduct.getNewPrice().multiply(BigDecimal.valueOf(quantity));
            } else {
                newTotalPrice = cartProduct.getPrice().multiply(BigDecimal.valueOf(quantity));
            }

            cartProduct.setQuantity(quantity);
            cartProduct.setTotalPrice(newTotalPrice);

            cartProductRepository.save(cartProduct);
        }
    }

    @Override
    public void delete(String id) {
        cartProductRepository.deleteById(id);
    }

    @Override
    public void deleteAll(List<CartProduct> cartProducts) {
        cartProductRepository.deleteAll(cartProducts);
    }

}
