package com.service;

import java.util.List;

import com.dto.category.CategoryRequestDTO;
import com.dto.category.CategoryResponseDTO;
import org.springframework.data.domain.Page;

public interface CategoryService {

    void saveData(CategoryRequestDTO categoryRequestDTO);

    Page<CategoryResponseDTO> findAll(int page, int size);

    CategoryResponseDTO findById(String id);

    String deleteById(String id);

    List<CategoryResponseDTO> findByParentIsNull();

    List<CategoryResponseDTO> findByParentIsNotNull();

    void updatePosition(List<CategoryRequestDTO> categoryRequestDTOList);
}
