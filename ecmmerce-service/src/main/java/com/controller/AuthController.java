package com.controller;

import com.common.utils.ExceptionUtil;
import com.common.utils.StringStatic;
import com.dto.login.AuthResponseDTO;
import com.dto.login.LoginRequestDTO;
import com.dto.register.RegisterDTO;
import com.response.MessageResponse;
import com.service.AuthService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            userService.registerUser(registerDTO);
            messageResponse.setMessage(StringStatic.SAVE);
            return ResponseEntity.ok().body(messageResponse);
        } catch (ExceptionUtil e) {
            messageResponse.setMessage(StringStatic.USER_EXITS);
            messageResponse.setErrorKey("USERNAME_TAKEN");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(messageResponse);
        }catch(Exception e) {
            e.printStackTrace();
            messageResponse.setMessage(StringStatic.ERROR);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(messageResponse);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        AuthResponseDTO authResponseDTO = authService.login(loginRequestDTO);
        return ResponseEntity.ok().body(authResponseDTO);
    }

    @GetMapping("/validate-token")
    public ResponseEntity<MessageResponse> validateToken(@RequestHeader("Authorization") String token) {
        MessageResponse messageResponse = new MessageResponse();

        try {
            boolean isValid = authService.validateToken(token);

            if (!isValid) {
                messageResponse.setMessage(StringStatic.NOT_EXPIRED);
                return ResponseEntity.ok(messageResponse);
            } else {
                messageResponse.setMessage(StringStatic.EXPIRED);
                return ResponseEntity.status(401).body(messageResponse);
            }
        } catch (ExceptionUtil e) {
            messageResponse.setMessage(StringStatic.ERROR);
            return ResponseEntity.status(400).body(messageResponse);
        }
    }
}
