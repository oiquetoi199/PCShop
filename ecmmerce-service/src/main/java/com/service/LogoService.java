package com.service;

import com.dto.productdto.LogoReqDTO;
import com.model.Logo;

import java.util.List;

public interface LogoService {
    /** Cập nhật thông tin logo của hệ thống. */
    void updateLogo(LogoReqDTO logoReqDTO) throws Exception;

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    List<Logo> getLogoList();

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    Logo getLogo();
}
