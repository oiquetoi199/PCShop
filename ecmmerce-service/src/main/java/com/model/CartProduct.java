package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String image;
    private String productName;
    private String productType;
    @Column(precision = 50, scale = 2)
    private BigDecimal price;
    @Column(precision = 50, scale = 2)
    private BigDecimal newPrice;
    private int saleRate;
    @Column(precision = 50, scale = 2)
    private BigDecimal totalPrice;
    private int quantity;
    private String productId;
    private String username;
    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm")
    private LocalDateTime createDateTime;
}
