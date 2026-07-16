package com.common.utils;

public class ExceptionUtil extends RuntimeException{
    private String errorKey;

    /** Khởi tạo đối tượng ExceptionUtil với các dữ liệu ban đầu. */
    public ExceptionUtil(String message, String errorKey) {
        super(message);
        this.errorKey = errorKey;
    }

    /** Lấy mã lỗi dùng để nhận diện loại ngoại lệ nghiệp vụ. */
    public String getErrorKey() {
        return errorKey;
    }
}
