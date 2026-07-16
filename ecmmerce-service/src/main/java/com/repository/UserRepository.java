package com.repository;

import com.dto.dashboard.DashboardDTO;
import com.dto.user.RoleResDTO;
import com.dto.user.UserResDTO;
import com.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    /** Tìm người dùng theo tên đăng nhập được cung cấp. */
    User findByUsername(String username);

    /** Lấy danh sách người dùng có phân trang để phục vụ quản trị. */
    @Query("SELECT new com.dto.user.UserResDTO(u.id, u.username, u.fullName, u.email, u.phone, u.address, r.name, u.createDate, u.updateDate) " +
            "FROM User u JOIN u.roles r")
    Page<UserResDTO> findUserList(Pageable pageable);

    /** Tìm người dùng theo tên đăng nhập và tải kèm danh sách vai trò. */
    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.username = :username")
    User findByUsernameWithRoles(@Param("username") String username);

    /** Cập nhật thông tin cá nhân của người dùng theo mã định danh. */
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.fullName = :fullName, u.email = :email, u.phone = :phone, " +
            "u.address = :address, u.wards = :wards, u.district = :district, u.province = :province, u.updateDate = CURRENT_DATE " +
            "WHERE u.id = :id")
    void updateUserInfoById(@Param("id") String id,
                           @Param("fullName") String fullName,
                           @Param("email") String email,
                           @Param("phone") String phone,
                           @Param("address") String address,
                           @Param("wards") String wards,
                           @Param("district") String district,
                           @Param("province") String province);

    /** Tìm thông tin người dùng theo mã người dùng. */
    @Query("SELECT new com.dto.user.UserResDTO(u.id, u.username, u.fullName, u.email, u.phone, u.address,u.wards, u.district,u.province,r.id, r.name, u.createDate, u.updateDate) " +
            "FROM User u JOIN u.roles r WHERE u.id = :id")
    UserResDTO findByUserId(String id);

    /** Lấy toàn bộ vai trò đang được cấu hình trong hệ thống. */
    @Query("SELECT new com.dto.user.RoleResDTO(r.id, r.name) " +
            "FROM Role r")
    List<RoleResDTO> findAllRoles();
}
