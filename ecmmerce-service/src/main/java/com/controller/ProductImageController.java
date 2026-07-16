package com.controller;

import com.common.utils.StringStatic;
import com.dto.banner.BannerDTO;
import com.dto.productdto.ProductImageUpdateDTO;
import com.model.ProductImage;
import com.response.MessageResponse;
import com.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/product-image")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    /** Cập nhật thông tin hình ảnh sản phẩm theo dữ liệu được cung cấp. */
    @PostMapping("/update")
    public ResponseEntity<MessageResponse> update(@ModelAttribute ProductImageUpdateDTO productImageUpdateDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            productImageService.update(productImageUpdateDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Tìm danh sách hình ảnh sản phẩm theo mã sản phẩm. */
    @GetMapping("/find-product-id/{productId}")
    public ResponseEntity<List<ProductImage>> findByProductId(@PathVariable  String productId) {
        return ResponseEntity.ok().body(productImageService.findByProductId(productId));
    }

    /** Lấy danh sách banner phục vụ chức năng quản trị. */
    @GetMapping("/banner")
    public ResponseEntity<List<BannerDTO>> getBannerList() {
        return ResponseEntity.ok().body(productImageService.getBannerList());
    }

    /** Lấy danh sách banner công khai dành cho người dùng chưa đăng nhập. */
    @GetMapping("/guest/banner")
    public ResponseEntity<List<BannerDTO>> getBannerListGuest() {
        return ResponseEntity.ok().body(productImageService.getBannerList());
    }

    /** Cập nhật nội dung banner hiển thị trên giao diện. */
    @PostMapping("/update-banner")
    public ResponseEntity<MessageResponse> updateBanner(@ModelAttribute ProductImageUpdateDTO productImageUpdateDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            productImageService.updateBanner(productImageUpdateDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }
}
