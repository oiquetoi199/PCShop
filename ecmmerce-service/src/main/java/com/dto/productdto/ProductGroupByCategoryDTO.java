package com.dto.productdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductGroupByCategoryDTO {
    private String parentId;
    private String categoryName;
    private String categoryColor;
    private List<PopularRecipeDTO> popularRecipeDTOS;
}
