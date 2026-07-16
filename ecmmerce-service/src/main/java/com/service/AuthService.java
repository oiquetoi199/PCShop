package com.service;

import com.dto.login.AuthResponseDTO;
import com.dto.login.LoginRequestDTO;

public interface AuthService {
    /** Xác thực thông tin đăng nhập và trả về mã JWT cùng quyền của người dùng. */
    AuthResponseDTO login (LoginRequestDTO loginRequestDTO);

    /** Kiểm tra tính hợp lệ và thời hạn của mã JWT. */
    boolean validateToken(String token);
}
