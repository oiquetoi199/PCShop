package com.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductListDTO {
    private String id;
    private String productName;
    private String productInfo;
    private String description;
    private BigDecimal price;
    private BigDecimal newPrice;
    private int saleRate;
    private String isButtonContact;
    private String initBy;
    private String updateBy;
    private LocalDate createDate;
    private LocalDate updateDate;
    private String categoryId;
    private String categoryName;
    private String productType;

    public ProductListDTO(String id, String productName, String productInfo, String description, BigDecimal price, int saleRate, String isButtonContact, String initBy, String updateBy, LocalDate createDate, LocalDate updateDate, String categoryId, String categoryName) {
        this.id = id;
        this.productName = productName;
        this.productInfo = productInfo;
        this.description = description;
        this.price = price;
        this.saleRate = saleRate;
        this.isButtonContact = isButtonContact;
        this.initBy = initBy;
        this.updateBy = updateBy;
        this.createDate = createDate;
        this.updateDate = updateDate;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }
}
