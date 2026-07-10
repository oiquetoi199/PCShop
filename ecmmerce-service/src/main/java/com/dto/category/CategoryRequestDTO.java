package com.dto.category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequestDTO {
    private String id;
    private String categoryName;
    private String parentId;
    private String parentName;
    private String position;
    private String color;
    private String initBy;
    private String updateBy;
    private LocalDate createDate;
    private LocalDate updateDate;
}
