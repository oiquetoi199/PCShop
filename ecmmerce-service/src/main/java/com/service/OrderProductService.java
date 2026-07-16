package com.service;


import com.dto.cart.CartProductOrderDTO;
import com.dto.orderproduct.OrderProductDTO;
import com.model.OrderProduct;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderProductService {
    /** Tạo đơn hàng, sao chép dữ liệu giỏ hàng sang chi tiết đơn và xóa giỏ hàng sau khi lưu. */
    void save(CartProductOrderDTO cartProductOrderDTO);

    /** Lấy danh sách đơn hàng có phân trang. */
    Page<OrderProductDTO> findAll(int page, int size);

    /** Lấy danh sách đơn hàng của người dùng hiện tại có phân trang. */
    Page<OrderProductDTO> findByUsername(int page, int size);

    /** Tìm đơn hàng theo mã định danh. */
    OrderProductDTO findById(String id);

    /** Tìm đơn hàng theo người dùng hiện tại và mã định danh. */
    OrderProductDTO findByUsernameAndId(String id);

    /** Xóa đơn hàng theo mã định danh. */
    void deleteById(String id);

    /** Chuyển đơn hàng sang trạng thái xử lý kế tiếp và lưu thay đổi. */
    void updateStatus(String id, int status);
}
