package com.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.common.utils.AuthUtils;
import com.dto.category.CategoryRequestDTO;
import com.dto.category.CategoryResponseDTO;
import com.model.Product;
import com.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.model.Category;
import com.repository.CategoryRepository;
import com.service.CategoryService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    /** Chuyển đổi, kiểm tra và lưu dữ liệu được cung cấp vào cơ sở dữ liệu. */
    @Override
    public void saveData(CategoryRequestDTO categoryRequestDTO) {
        if (categoryRequestDTO != null) {
            Category category = new Category();
            BeanUtils.copyProperties(categoryRequestDTO, category);

            if (categoryRequestDTO.getParentId() != null) {
                Optional<Category> categoryOptional = categoryRepository.findById(categoryRequestDTO.getParentId());
                categoryOptional.ifPresent(category::setParent);
            }

            if ((categoryRequestDTO.getParentId() == null || categoryRequestDTO.getParentId().isEmpty()) && "".equals(categoryRequestDTO.getPosition())) {
                String maxOption = categoryRepository.findMaxPosition();

                if (maxOption != null) {
                    category.setPosition(String.valueOf(Integer.parseInt(maxOption) + 1));
                } else {
                    category.setPosition("1");
                }
            }

            if (category.getId() != null) {
                category.setUpdateBy(AuthUtils.getCurrentUsername());
                category.setUpdateDate(LocalDate.now());
            } else {
                category.setInitBy(AuthUtils.getCurrentUsername());
                category.setCreateDate(LocalDate.now());
            }

            categoryRepository.save(category);
        }
    }

    /** Lấy danh sách danh mục có phân trang. */
    @Override
    public Page<CategoryResponseDTO> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Category> categories = categoryRepository.findAll(pageable);

        return categories.map(this::convertToCategoryResponseDTO);
    }

    /** Chuyển thực thể danh mục sang DTO phản hồi và bổ sung dữ liệu liên quan. */
    private CategoryResponseDTO convertToCategoryResponseDTO(Category category) {
        return new CategoryResponseDTO(
                category.getId(),
                category.getCategoryName(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.getParent() != null ? category.getParent().getCategoryName() : null,
                category.getPosition(),
                category.getColor(),
                category.getInitBy(),
                category.getUpdateBy(),
                category.getCreateDate(),
                category.getUpdateDate()
        );
    }

    /** Tìm danh mục theo mã định danh. */
    @Override
    public CategoryResponseDTO findById(String id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);

        return categoryOptional.map(category -> new CategoryResponseDTO(
                category.getId(),
                category.getCategoryName(),
                category.getParent() != null ? category.getParent().getId() : null,
                category.getParent() != null ? category.getParent().getCategoryName() : null,
                category.getPosition(),
                category.getColor(),
                category.getInitBy(),
                category.getUpdateBy(),
                category.getCreateDate(),
                category.getUpdateDate()
        )).orElse(null);
    }

    /** Xóa danh mục theo mã định danh. */
    @Override
    @Transactional
    public String deleteById(String id) {
        Optional<Category> categoryOptional = categoryRepository.findById(id);

        if (categoryOptional.isEmpty()) {
            return "error";
        }

        Category category = categoryOptional.get();

        if (category.getParent() == null) {
            List<Category> childCategories = categoryRepository.findByParent_IdOrderByPositionAsc(category.getId());
            if (CollectionUtils.isEmpty(childCategories)) {
                categoryRepository.deleteById(id);
                return "deleted";
            }
        } else {
            List<Product> products = productRepository.findTop3ByCategoryIdOrderByCreateDateDesc(category.getId());
            if (CollectionUtils.isEmpty(products)) {
                categoryRepository.deleteById(id);
                return "deleted";
            }
        }

        return "error";
    }


    /** Lấy danh sách các danh mục cha. */
    @Override
    public List<CategoryResponseDTO> findByParentIsNull() {
        List<Category> categories = categoryRepository.findByParentIsNullOrderByPositionAsc();

        return getCategoryResponseDTOS(categories);
    }

    /** Lấy danh sách các danh mục con. */
    @Override
    public List<CategoryResponseDTO> findByParentIsNotNull() {
        List<Category> categories = categoryRepository.findByParentIsNotNullOrderByPositionAsc();

        return getCategoryResponseDTOS(categories);
    }

    /** Cập nhật thứ tự hiển thị của các danh mục. */
    @Override
    public void updatePosition(List<CategoryRequestDTO> categoryRequestDTOList) {
        List<Category> categories = new ArrayList<>();
        for (CategoryRequestDTO categoryRequestDTO : categoryRequestDTOList) {
            Category category = new Category();
            BeanUtils.copyProperties(categoryRequestDTO, category);

            categories.add(category);
        }

        categoryRepository.saveAll(categories);
    }

    /** Chuyển danh sách danh mục sang DTO dùng cho phản hồi API. */
    private List<CategoryResponseDTO> getCategoryResponseDTOS(List<Category> categories) {
        return categories.stream()
                .map(category -> new CategoryResponseDTO(
                        category.getId(),
                        category.getCategoryName(),
                        category.getParent() != null ? category.getParent().getId() : null,
                        category.getParent() != null ? category.getParent().getCategoryName() : null,
                        category.getPosition(),
                        category.getColor(),
                        category.getInitBy(),
                        category.getUpdateBy(),
                        category.getCreateDate(),
                        category.getUpdateDate()
                ))
                .collect(Collectors.toList());
    }

}
