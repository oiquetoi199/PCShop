package com.service;

import com.dto.login.AuthResponseDTO;
import com.dto.login.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login (LoginRequestDTO loginRequestDTO);

    boolean validateToken(String token);
}
