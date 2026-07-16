package com.service;

import java.util.List;

import com.dto.category.CategoryRequestDTO;
import com.dto.category.CategoryResponseDTO;
import org.springframework.data.domain.Page;

public interface CategoryService {

    /** Chuyển đổi, kiểm tra và lưu dữ liệu được cung cấp vào cơ sở dữ liệu. */
    void saveData(CategoryRequestDTO categoryRequestDTO);

    /** Lấy danh sách danh mục có phân trang. */
    Page<CategoryResponseDTO> findAll(int page, int size);

    /** Tìm danh mục theo mã định danh. */
    CategoryResponseDTO findById(String id);

    /** Xóa danh mục theo mã định danh. */
    String deleteById(String id);

    /** Lấy danh sách các danh mục cha. */
    List<CategoryResponseDTO> findByParentIsNull();

    /** Lấy danh sách các danh mục con. */
    List<CategoryResponseDTO> findByParentIsNotNull();

    /** Cập nhật thứ tự hiển thị của các danh mục. */
    void updatePosition(List<CategoryRequestDTO> categoryRequestDTOList);
}
