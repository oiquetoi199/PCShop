package com.common.utils;

public class ExceptionUtil extends RuntimeException{
    private String errorKey;

    public ExceptionUtil(String message, String errorKey) {
        super(message);
        this.errorKey = errorKey;
    }

    public String getErrorKey() {
        return errorKey;
    }
}
