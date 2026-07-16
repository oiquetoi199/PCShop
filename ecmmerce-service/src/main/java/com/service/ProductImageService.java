package com.service;

import com.dto.banner.BannerDTO;
import com.dto.productdto.ProductImageUpdateDTO;
import com.model.ProductImage;

import java.util.List;

public interface ProductImageService {
    /** Kiểm tra và lưu hình ảnh sản phẩm vào cơ sở dữ liệu. */
    void save(List<ProductImage> productImages) throws Exception;

    /** Tìm danh sách hình ảnh sản phẩm theo mã sản phẩm. */
    List<ProductImage> findByProductId(String productId);

    /** Cập nhật thông tin hình ảnh sản phẩm theo dữ liệu được cung cấp. */
    void update(ProductImageUpdateDTO productImageUpdateDTO) throws Exception;

    /** Xóa hình ảnh sản phẩm theo mã sản phẩm. */
    void deleteByProductId(String productId);

    /** Tìm ảnh đại diện của sản phẩm theo mã sản phẩm. */
    List<ProductImage> findByProductIdAndIsThumbnail(String productId, Boolean isThumbnail);

    /** Lấy danh sách banner phục vụ chức năng quản trị. */
    List<BannerDTO> getBannerList();

    /** Cập nhật nội dung banner hiển thị trên giao diện. */
    void updateBanner(ProductImageUpdateDTO productImageUpdateDTO) throws Exception;
}
