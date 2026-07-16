package com.controller;

import java.util.List;

import com.dto.category.CategoryRequestDTO;
import com.dto.category.CategoryResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.common.utils.StringStatic;
import com.response.MessageResponse;
import com.service.CategoryService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/category")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;

    /** Kiểm tra và lưu danh mục vào cơ sở dữ liệu. */
    @PostMapping("/save")
    public ResponseEntity<MessageResponse> save(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            categoryService.saveData(categoryRequestDTO);
           
            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Lấy danh sách danh mục có phân trang. */
    @GetMapping("/find-all")
    public ResponseEntity<Page<CategoryResponseDTO>> findAll(@RequestParam int page,
                                                             @RequestParam int size) {
        return ResponseEntity.ok().body(categoryService.findAll(page, size));
    }

    /** Lấy danh sách danh mục cha để xây dựng cấu trúc phân cấp. */
    @GetMapping("/find-parent")
    public ResponseEntity<List<CategoryResponseDTO>> findParentAll() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNull());
    }

    /** Lấy cấu trúc menu con từ các danh mục đang có. */
    @GetMapping("/guest/find-parent")
    public ResponseEntity<List<CategoryResponseDTO>> findSubMenu() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNull());
    }

    /** Lấy danh sách danh mục con phù hợp với phạm vi truy cập. */
    @GetMapping("/find-child")
    public ResponseEntity<List<CategoryResponseDTO>> findChildAll() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNotNull());
    }

    /** Lấy danh sách danh mục con phù hợp với phạm vi truy cập. */
    @GetMapping("/guest/find-child")
    public ResponseEntity<List<CategoryResponseDTO>> findChildGuest() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNotNull());
    }

    /** Tìm danh mục theo mã định danh. */
    @GetMapping("/detail/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(categoryService.findById(id));
    }

    /** Cập nhật thông tin danh mục theo dữ liệu được cung cấp. */
    @PutMapping("/update")
    public ResponseEntity<MessageResponse> update(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            categoryService.saveData(categoryRequestDTO);
           
            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Xóa danh mục theo mã định danh. */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            String result = categoryService.deleteById(id);

            if ("deleted".equals(result)) {
                messageResponse.setMessage(StringStatic.SUCCESS);
            } else {
                messageResponse.setMessage(StringStatic.DELETE_ERR);
            }
        } catch(Exception e) {
            e.printStackTrace();
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }

    /** Cập nhật thứ tự hiển thị của các danh mục. */
    @PutMapping("/update-position")
    public ResponseEntity<MessageResponse> updatePosition(@RequestBody List<CategoryRequestDTO> categories) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            categoryService.updatePosition(categories);

            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }

        return ResponseEntity.ok().body(messageResponse);
    }
}
