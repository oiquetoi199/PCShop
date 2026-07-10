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
@Table(name = "order_product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String orderCode;
    private String fullName;
    private String phone;
    private String address;
    private int cartTotalQuantity;
    @Column(precision = 50, scale = 2)
    private BigDecimal cartTotalPrice;
    private String discountCode;
    @Column(precision = 50, scale = 2)
    private BigDecimal discountPrice;
    @Column(precision = 50, scale = 2)
    private BigDecimal deliveryPrice;
    private BigDecimal paymentAmount;
    private String note;
    private String username;
    private int status;

    @DateTimeFormat(pattern = "yyyy-MM-dd hh:mm")
    private LocalDateTime createDateTime;
}
