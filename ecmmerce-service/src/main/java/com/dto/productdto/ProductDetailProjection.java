package com.dto.productdto;

import java.math.BigDecimal;

public interface ProductDetailProjection {
    String getId();
    String getProductName();
    String getImage();
    BigDecimal getPrice();
    String getIsButtonContact();
    int getSaleRate();
}
