package com.service;

import com.dto.productdto.LogoReqDTO;
import com.model.Logo;

import java.util.List;

public interface LogoService {
    void updateLogo(LogoReqDTO logoReqDTO) throws Exception;

    List<Logo> getLogoList();

    Logo getLogo();
}
