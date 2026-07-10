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

    @GetMapping("/list")
    public ResponseEntity<Page<UserResDTO>> findUserList(@RequestParam int page,
                                                         @RequestParam int size) {
        return ResponseEntity.ok().body(userService.findUserList(page, size));
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<UserResDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok().body(userService.findById(id));
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleResDTO>> getRoles() {
        return ResponseEntity.ok().body(userService.getRoles());
    }

    @GetMapping("/detail-username")
    public ResponseEntity<User> findByUsername() {
        return ResponseEntity.ok().body(userService.findByUsername());
    }

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

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok().body(userService.getDashboard());
    }

}
