package com.service;

import com.model.Contact;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ContactService {
    /** Kiểm tra và lưu thông tin liên hệ vào cơ sở dữ liệu. */
    void save(Contact contact);

    /** Lấy danh sách thông tin liên hệ có phân trang. */
    Page<Contact> findAll(int page, int size);

    /** Chuyển đơn hàng sang trạng thái xử lý kế tiếp và lưu thay đổi. */
    void updatStatus(String id);

    /** Xóa thông tin liên hệ theo mã định danh. */
    void deleteById(String id);
}
