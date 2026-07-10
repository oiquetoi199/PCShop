package com.dto.productdto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductSaveDTO {
    private String id;
    private String productName;
    private String productInfo;
    private String description;
    private BigDecimal price;
    private String isButtonContact;
    private int saleRate; 
    private String categoryId;
    private String initBy;
    private String updateBy;
    private LocalDate createDate;
    private LocalDate updateDate;
    private List<MultipartFile> images;
    private List<String> productTypes;
}
