package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "product_type")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductType {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private String initBy;
    private String updateBy;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate;
    private String productId;
}
