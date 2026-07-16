package com.dto.productdto;

import java.math.BigDecimal;

public interface ProductDetailProjection {
    /** Lấy mã định danh của sản phẩm. */
    String getId();
    /** Lấy tên sản phẩm. */
    String getProductName();
    /** Lấy dữ liệu hình ảnh của sản phẩm. */
    String getImage();
    /** Lấy giá gốc của sản phẩm. */
    BigDecimal getPrice();
    /** Lấy trạng thái cho biết sản phẩm có sử dụng nút liên hệ hay không. */
    String getIsButtonContact();
    /** Lấy tỷ lệ giảm giá của sản phẩm. */
    int getSaleRate();
}
