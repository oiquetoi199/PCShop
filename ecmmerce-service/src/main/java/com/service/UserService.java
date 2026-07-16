package com.service;

import com.dto.dashboard.DashboardDTO;
import com.dto.register.RegisterDTO;
import com.dto.user.RoleResDTO;
import com.dto.user.UserReqDTO;
import com.dto.user.UserResDTO;
import com.model.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    /** Kiểm tra dữ liệu đăng ký, mã hóa mật khẩu và tạo tài khoản người dùng mới. */
    void registerUser(RegisterDTO registerDTO);
    /** Tìm người dùng theo mã định danh. */
    UserResDTO findById(String id);
    /** Lấy thông tin tài khoản của người dùng hiện tại. */
    User findByUsername();
    /** Cập nhật thông tin tài khoản và quyền của người dùng. */
    void updateUser(UserReqDTO userReqDTO);
    /** Lấy danh sách người dùng có phân trang để phục vụ quản trị. */
    Page<UserResDTO> findUserList(int page, int size);
    /** Xóa tài khoản người dùng theo mã định danh. */
    void deleteUser(String id);
    /** Lấy danh sách vai trò của người dùng để trả về cho client. */
    List<RoleResDTO> getRoles();
    /** Tổng hợp các số liệu cần thiết để hiển thị trên trang quản trị. */
    DashboardDTO getDashboard();
}
