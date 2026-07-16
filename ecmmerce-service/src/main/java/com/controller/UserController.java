package com.controller;

import com.common.utils.StringStatic;
import com.dto.dashboard.DashboardDTO;
import com.dto.user.RoleResDTO;
import com.dto.user.UserReqDTO;
import com.dto.user.UserResDTO;
import com.model.User;
import com.response.MessageResponse;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;

    /** Lấy danh sách người dùng có phân trang để phục vụ quản trị. */
    @GetMapping("/list")
    public ResponseEntity<Page<UserResDTO>> findUserList(@RequestParam int page,
                                                         @RequestParam int size) {
        return ResponseEntity.ok().body(userService.findUserList(page, size));
    }
    /** Tìm người dùng theo mã định danh. */
    @GetMapping("/detail/{id}")
    public ResponseEntity<UserResDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(userService.findById(id));
    }

    /** Lấy danh sách vai trò của người dùng để trả về cho client. */
    @GetMapping("/roles")
    public ResponseEntity<List<RoleResDTO>> getRoles() {
        return ResponseEntity.ok().body(userService.getRoles());
    }

    /** Lấy thông tin tài khoản của người dùng hiện tại. */
    @GetMapping("/detail-username")
    public ResponseEntity<User> findByUsername() {
        return ResponseEntity.ok().body(userService.findByUsername());
    }

    /** Cập nhật thông tin tài khoản và quyền của người dùng. */
    @PutMapping("/update")
    public ResponseEntity<MessageResponse> updateUser(@RequestBody UserReqDTO userReqDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            userService.updateUser(userReqDTO);
            messageResponse.setMessage(StringStatic.SAVE);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }
        return ResponseEntity.ok().body(messageResponse);
    }

    /** Xóa tài khoản người dùng theo mã định danh. */
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable String id) {
        MessageResponse messageResponse = new MessageResponse();
        try {
            userService.deleteUser(id);
            messageResponse.setMessage(StringStatic.SUCCESS);
        } catch(Exception e) {
            messageResponse.setMessage(StringStatic.ERROR);
        }
        return ResponseEntity.ok().body(messageResponse);
    }

    /** Tổng hợp các số liệu cần thiết để hiển thị trên trang quản trị. */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok().body(userService.getDashboard());
    }

}
