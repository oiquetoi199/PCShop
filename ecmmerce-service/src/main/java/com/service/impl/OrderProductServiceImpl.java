package com.service.impl;

import com.common.utils.AuthUtils;
import com.dto.cart.CartProductOrderDTO;
import com.dto.orderproduct.OrderProductDTO;
import com.model.CartProduct;
import com.model.OrderProduct;
import com.model.OrderProductItem;
import com.repository.OderProductRepository;
import com.repository.OrderProductItemRepository;
import com.service.CartProductService;
import com.service.OrderProductItemService;
import com.service.OrderProductService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderProductServiceImpl implements OrderProductService {
    @Autowired
    private OderProductRepository oderProductRepository;

    @Autowired
    private OrderProductItemRepository orderProductItemRepository;

    @Autowired
    private OrderProductItemService orderProductItemService;

    @Autowired
    private CartProductService cartProductService;

    @Override
    public void save(CartProductOrderDTO cartProductOrderDTO) {
        int randomNumber = 10000000 + (int)(Math.random() * 90000000);

        OrderProduct orderProduct = new OrderProduct();

        orderProduct.setOrderCode(String.valueOf(randomNumber));
        orderProduct.setFullName(cartProductOrderDTO.getFullName());
        orderProduct.setPhone(cartProductOrderDTO.getPhone());
        orderProduct.setAddress(cartProductOrderDTO.getAddress());
        orderProduct.setNote(cartProductOrderDTO.getNote());
        orderProduct.setCartTotalQuantity(cartProductOrderDTO.getCartTotalQuantity());
        orderProduct.setCartTotalPrice(cartProductOrderDTO.getCartTotalPrice());
        orderProduct.setDeliveryPrice(cartProductOrderDTO.getDeliveryPrice());
        orderProduct.setPaymentAmount(cartProductOrderDTO.getPaymentAmount());
        orderProduct.setUsername(AuthUtils.getCurrentUsername());
        orderProduct.setCreateDateTime(LocalDateTime.now());
        orderProduct.setStatus(0);

        OrderProduct resultSave = oderProductRepository.save(orderProduct);

        List<CartProduct> cartProducts = cartProductOrderDTO.getCartProducts();
        List<OrderProductItem> orderProductItems = new ArrayList<>();

        for (CartProduct item : cartProducts) {
            OrderProductItem orderProductItem = new OrderProductItem();

            BeanUtils.copyProperties(item, orderProductItem);
            orderProductItem.setOrderProductId(resultSave.getId());
            orderProductItem.setUsername(AuthUtils.getCurrentUsername());
            orderProductItems.add(orderProductItem);
        }

        orderProductItemService.save(orderProductItems);
        cartProductService.deleteAll(cartProducts);
    }

    @Override
    @Transactional
    public Page<OrderProductDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderProduct> orderProductPage = oderProductRepository.findAll(pageable);

        return orderProductPage.map(this::convertToOrderProductDTO);
    }

    private OrderProductDTO convertToOrderProductDTO(OrderProduct orderProduct) {
        OrderProductDTO orderProductDTO = new OrderProductDTO();
        orderProductDTO.setOrderProduct(orderProduct);
        List<OrderProductItem> orderProductItems = orderProductItemService.findByOrderProductId(orderProduct.getId());
        orderProductDTO.setOrderProductItemList(orderProductItems);
        return orderProductDTO;
    }

    @Override
    @Transactional
    public Page<OrderProductDTO> findByUsername(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderProduct> orderProductPage = oderProductRepository.findByUsername(AuthUtils.getCurrentUsername(), pageable);

        return orderProductPage.map(this::convertToOrderProductDTO);
    }

    @Override
    @Transactional
    public OrderProductDTO findById(String id) {
        Optional<OrderProduct> orderProduct = oderProductRepository.findById(id);
        OrderProduct orderProductResult = new OrderProduct();
        orderProduct.ifPresent(value -> BeanUtils.copyProperties(value, orderProductResult));

        List<OrderProductItem> orderProductItems = orderProductItemService.findByOrderProductId(orderProductResult.getId());

        OrderProductDTO orderProductDTO = new OrderProductDTO();
        orderProductDTO.setOrderProduct(orderProductResult);
        orderProductDTO.setOrderProductItemList(orderProductItems);

        return orderProductDTO;
    }

    @Override
    @Transactional
    public OrderProductDTO findByUsernameAndId(String id) {
        OrderProduct orderProduct = oderProductRepository.findByUsernameAndId(AuthUtils.getCurrentUsername(), id);
        List<OrderProductItem> orderProductItems = orderProductItemService.findByOrderProductId(orderProduct.getId());

        OrderProductDTO orderProductDTO = new OrderProductDTO();
        orderProductDTO.setOrderProduct(orderProduct);
        orderProductDTO.setOrderProductItemList(orderProductItems);

        return orderProductDTO;
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        List<OrderProductItem> orderProductItems = orderProductItemService.findByOrderProductId(id);
        orderProductItemRepository.deleteAll(orderProductItems);
        oderProductRepository.deleteById(id);
    }

    @Override
    public void updateStatus(String id, int status) {
        Optional<OrderProduct> orderProduct = oderProductRepository.findById(id);

        if (orderProduct.isPresent()) {
            OrderProduct orderProductResult = orderProduct.get();
            switch (status) {
                case 0: status = 1; break;
                case 1: status = 2; break;
                case 2: status = 3; break;
                case 3: status = 4; break;
            }
            orderProductResult.setStatus(status);
            oderProductRepository.save(orderProductResult);
        }
    }
}
