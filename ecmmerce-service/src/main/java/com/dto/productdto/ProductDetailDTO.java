package com.dto.productdto;

import com.model.ProductImage;
import com.model.ProductType;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {
    private String id;
    private String productName;
    private String productInfo;
    private String description;
    private String image;
    private List<ProductImage> productImageList;
    private BigDecimal price;
    private BigDecimal newPrice;
    private String isButtonContact;
    private int saleRate;
    private String categoryId;
    private List<ProductType> productTypes;

    /** Khởi tạo đối tượng ProductDetailDTO với các dữ liệu ban đầu. */
    public ProductDetailDTO(String id, String productName, String productInfo, String image, BigDecimal price, String isButtonContact, int saleRate) {
        this.id = id;
        this.productName = productName;
        this.productInfo = productInfo;
        this.image = image;
        this.price = price;
        this.isButtonContact = isButtonContact;
        this.saleRate = saleRate;
    }
}
