package com.service;

import com.dto.cart.CartProductDTO;
import com.model.CartProduct;

import java.util.List;

public interface CartProductService {
    /** Kiểm tra và lưu sản phẩm trong giỏ hàng vào cơ sở dữ liệu. */
    void save(CartProduct cartProduct);

    /** Lấy giỏ hàng của người dùng hiện tại và tính các giá trị tổng hợp. */
    CartProductDTO findByUsername();

    /** Cập nhật thông tin sản phẩm trong giỏ hàng theo dữ liệu được cung cấp. */
    void update(String id, int quantity);

    /** Xóa sản phẩm trong giỏ hàng theo mã định danh. */
    void delete(String id);

    /** Xóa toàn bộ danh sách sản phẩm trong giỏ hàng được truyền vào. */
    void deleteAll(List<CartProduct> cartProducts);
}
