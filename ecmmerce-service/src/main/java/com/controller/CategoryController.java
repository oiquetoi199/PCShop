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

    @GetMapping("/find-all")
    public ResponseEntity<Page<CategoryResponseDTO>> findAll(@RequestParam int page,
                                                             @RequestParam int size) {
        return ResponseEntity.ok().body(categoryService.findAll(page, size));
    }

    @GetMapping("/find-parent")
    public ResponseEntity<List<CategoryResponseDTO>> findParentAll() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNull());
    }

    @GetMapping("/guest/find-parent")
    public ResponseEntity<List<CategoryResponseDTO>> findSubMenu() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNull());
    }

    @GetMapping("/find-child")
    public ResponseEntity<List<CategoryResponseDTO>> findChildAll() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNotNull());
    }

    @GetMapping("/guest/find-child")
    public ResponseEntity<List<CategoryResponseDTO>> findChildGuest() {
        return ResponseEntity.ok().body(categoryService.findByParentIsNotNull());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<CategoryResponseDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(categoryService.findById(id));
    }

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
