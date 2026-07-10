package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "order_product_item")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderProductItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;
    private String productName;
    private String productType;
    private int quantity;
    @Column(precision = 50, scale = 2)
    private BigDecimal price;
    @Column(precision = 50, scale = 2)
    private BigDecimal newPrice;
    private int saleRate;
    @Column(precision = 50, scale = 2)
    private BigDecimal totalPrice;
    private String productId;
    private String username;
    private String orderProductId;
}
