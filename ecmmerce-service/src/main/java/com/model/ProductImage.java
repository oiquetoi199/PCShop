package com.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product_image")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageData;
    private String productId;
    private Boolean isThumbnail;
    private Boolean isBanner;

    private String initBy;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
}