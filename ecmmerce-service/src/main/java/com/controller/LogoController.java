package com.controller;

import com.common.utils.StringStatic;
import com.dto.productdto.LogoReqDTO;
import com.model.Logo;
import com.response.MessageResponse;
import com.service.LogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/logo")
public class LogoController {

    @Autowired
    private LogoService logoService;

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    @GetMapping("/list")
    public ResponseEntity<List<Logo>> getLogoList() {
        return ResponseEntity.ok().body(logoService.getLogoList());
    }

    /** Lấy thông tin logo dùng để hiển thị trên giao diện. */
    @GetMapping("/guest/getLogo")
    public ResponseEntity<Logo> getLogo() {
        return ResponseEntity.ok().body(logoService.getLogo());
    }
    /** Cập nhật thông tin logo của hệ thống. */
    @PostMapping("/update")
    public ResponseEntity<MessageResponse> updateLogo(@ModelAttribute LogoReqDTO logoReqDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            logoService.updateLogo(logoReqDTO);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }
}
