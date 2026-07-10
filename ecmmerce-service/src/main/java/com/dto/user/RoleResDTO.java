package com.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
//@AllArgsConstructor
@NoArgsConstructor
public class RoleResDTO {
    String code;
    String name;

    public RoleResDTO(Long code, String name) {
        this.code = String.valueOf(code);
        this.name = name;
    }
}
