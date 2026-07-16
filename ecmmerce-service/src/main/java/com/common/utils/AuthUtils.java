package com.common.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Base64;

public class AuthUtils {
    /** Lấy tên đăng nhập của người dùng đang được xác thực trong hệ thống. */
    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getName(); // Trả về username của người dùng đã đăng nhập
        }
        return null;
    }
}
