package com.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private Long roleId;
    private String address;
    private String wards;
    private String district;
    private String province;
}
