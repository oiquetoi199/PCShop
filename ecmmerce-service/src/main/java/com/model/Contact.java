package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "contact")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String fullName;
    private String phone;
    private String address;
    private String note;
    private String  productId;
    private String productName;
    private String status;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate;
}
