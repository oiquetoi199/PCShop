package com.service.impl;

import com.dto.login.AuthResponseDTO;
import com.dto.login.LoginRequestDTO;
import com.model.Role;
import com.model.User;
import com.repository.UserRepository;
import com.security.jwt.JwtUtil;
import com.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword()));

        AuthResponseDTO authResponseDTO = new AuthResponseDTO();

        if (authentication != null) {
            // tạo token
            String token = jwtUtil.generateToken(authentication.getName());
            User user = userRepository.findByUsername(authentication.getName());

            Set<Role> roles = user.getRoles();
            Set<String> grantedAuthorities = new HashSet<>();

            for (Role role : roles) {
                grantedAuthorities.add(role.getName());
            }

            authResponseDTO.setUsername(authentication.getName());
            authResponseDTO.setToken(token);
            authResponseDTO.setRoles(grantedAuthorities);
        }

        return authResponseDTO;
    }

    @Override
    public boolean validateToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return jwtUtil.isTokenExpired(token);
    }
}

