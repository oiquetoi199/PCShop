package com.service.impl;

import com.common.utils.AuthUtils;
import com.common.utils.ExceptionUtil;
import com.dto.dashboard.DashboardDTO;
import com.dto.register.RegisterDTO;
import com.dto.user.RoleResDTO;
import com.dto.user.UserReqDTO;
import com.dto.user.UserResDTO;
import com.model.Category;
import com.model.ProductImage;
import com.model.Role;
import com.model.User;
import com.repository.*;
import com.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProductImageRepository  productImageRepository;
    @Autowired
    private OderProductRepository oderProductRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CategoryRepository categoryRepository;
//    @Autowired
//    private NewsRepository newsRepository;
    @Autowired
    private LogoRepository logoRepository;
//    @Autowired
//    private PolicyRepository policyRepository;

    public void registerUser(RegisterDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()) != null) {
            throw new ExceptionUtil("Username already taken", "USERNAME_TAKEN");
        }

        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        // mã hoá mật khẩu
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setCreateDate(LocalDate.now());

        Role userRole = roleRepository.findByName("USER");
        if (userRole == null) {
            userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
        }
        user.setRoles(Collections.singleton(userRole));

        userRepository.save(user);
    }

    @Override
    public UserResDTO findById(String id) {
        return userRepository.findByUserId(id);
    }

    @Override
    public User findByUsername() {
        return userRepository.findByUsername(AuthUtils.getCurrentUsername());
    }

    @Transactional
    @Override
    public void updateUser(UserReqDTO userReqDTO) {
        // Fetch user
        User user = userRepository.findById(userReqDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        // Update user information
        user.setFullName(userReqDTO.getFullName());
        user.setEmail(userReqDTO.getEmail());
        user.setPhone(userReqDTO.getPhone());
        user.setAddress(userReqDTO.getAddress());
        user.setWards(userReqDTO.getWards());
        user.setDistrict(userReqDTO.getDistrict());
        user.setProvince(userReqDTO.getProvince());
        user.setUpdateDate(LocalDate.now());

        // Update roles if roleId is provided
        if (Objects.nonNull(userReqDTO.getRoleId())) {
            roleRepository.findById(userReqDTO.getRoleId()).ifPresent(role -> {
                Set<Role> roles = new HashSet<>();
                roles.add(role);
                user.setRoles(roles);
            });
        }
        // Save user
        userRepository.save(user);
    }

    @Override
    public Page<UserResDTO> findUserList(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findUserList(pageable);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<RoleResDTO> getRoles() {
        return userRepository.findAllRoles();
    }

    @Override
    public DashboardDTO getDashboard() {
        Long userTotal = userRepository.count();
        Long productTotal = productRepository.count();
        Long orderTotal = oderProductRepository.count();
        Long categoryTotal = categoryRepository.count();
//        Long newTotal = newsRepository.count();
        Long logoTotal = logoRepository.count();
//        Long policyTotal = policyRepository.count();
        List<ProductImage> slideTotal = productImageRepository.findByIsBanner(true);
        return new DashboardDTO(userTotal, productTotal,orderTotal,categoryTotal/*, newTotal*/, logoTotal/*,policyTotal*/ , slideTotal.size());
    }
}