package com.service;

import com.dto.dashboard.DashboardDTO;
import com.dto.register.RegisterDTO;
import com.dto.user.RoleResDTO;
import com.dto.user.UserReqDTO;
import com.dto.user.UserResDTO;
import com.model.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    void registerUser(RegisterDTO registerDTO);
    UserResDTO findById(String id);
    User findByUsername();
    void updateUser(UserReqDTO userReqDTO);
    Page<UserResDTO> findUserList(int page, int size);
    void deleteUser(String id);
    List<RoleResDTO> getRoles();
    DashboardDTO getDashboard();
}
