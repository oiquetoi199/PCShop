package com.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
//@AllArgsConstructor
@NoArgsConstructor
public class UserResDTO {
    private String id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String wards;
    private String district;
    private String province;
    private String roleId;

    public UserResDTO(String id, String username, String fullName, String email, String phone, String address, String wards, String district, String province, Long roleId, String role, LocalDate createDate, LocalDate updateDate) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.wards = wards;
        this.district = district;
        this.province = province;
        this.roleId = String.valueOf(roleId);
        this.role = role;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    private String role;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate;

    public UserResDTO(String id, String username, String fullName, String email, String phone, String address, String role, LocalDate createDate, LocalDate updateDate) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }
}
