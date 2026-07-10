package com.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String productName;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String productInfo;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String description;
    @Column(precision = 50, scale = 2)
    private BigDecimal price;
    private int saleRate;

    private String isButtonContact;
    private String initBy;
    private String updateBy;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate;

    private String categoryId;
}