package com.service.impl;

import com.common.utils.AuthUtils;
import com.dto.productdto.LogoReqDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.Logo;
import com.repository.LogoRepository;
import com.service.LogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class LogoServiceImpl implements LogoService {

    @Autowired
    private LogoRepository logoRepository;

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    @Override
    @Transactional
    public List<Logo> getLogoList() {
        return logoRepository.findAll();
    }

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    @Override
    @Transactional
    public Logo getLogo() {
        return logoRepository.findFirstByIsLogoTrue();
    }

    /** Cập nhật thông tin logo của hệ thống. */
    @Override
    @Transactional
    public void updateLogo(LogoReqDTO logoReqDTO) throws Exception {
        List<Logo> logos = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> existingImages = objectMapper.readValue(logoReqDTO.getExistingImages(), new TypeReference<>() {});

        List<Logo> oldImages = logoRepository.findAll();
        List<String> deleteIds = new ArrayList<>();

        if (existingImages.isEmpty()) {
            logoRepository.deleteAll();
        } else if (!CollectionUtils.isEmpty(oldImages)) {
            String idImage = "";

            for (Logo logo : oldImages) {
                idImage = logo.getId();

                if (!existingImages.contains(idImage)) {
                    deleteIds.add(idImage);
                }
            }

            logoRepository.deleteByIdIn(deleteIds);
        }
        if(!CollectionUtils.isEmpty(logoReqDTO.getIsLogo()) && !CollectionUtils.isEmpty(existingImages)){
            List<Boolean> isLogos = logoReqDTO.getIsLogo();
            for (int i = 0; i < isLogos.size(); i++) {
                logoRepository.updateIsLogo(existingImages.get(i), isLogos.get(i));
            }
        }

        if (logoReqDTO.getImages() != null && !logoReqDTO.getImages().isEmpty()) {
            for (int i = 0; i < logoReqDTO.getImages().size(); i++) {
                MultipartFile imageFile = logoReqDTO.getImages().get(i);
                Logo logo = new Logo();
                logo.setImageData(Base64.getEncoder().encodeToString(imageFile.getBytes()));
                logo.setInitBy(AuthUtils.getCurrentUsername());
                logo.setCreateDate(LocalDate.now());
                logos.add(logo);
            }
            logoRepository.saveAll(logos);
        }
    }
}
