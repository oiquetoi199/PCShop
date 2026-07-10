package com.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogoReqDTO {
    private String existingImages;
    private List<MultipartFile> images;
    private List<Boolean> isLogo;
}
