package com.repository;

import com.model.Logo;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogoRepository extends JpaRepository<Logo, String> {
    /** Xóa nhiều logo có mã nằm trong danh sách được cung cấp. */
    void deleteByIdIn(List<String> listIds);
    /** Tìm bản ghi logo đầu tiên thỏa mãn điều kiện truy vấn. */
    Logo findFirstByIsLogoTrue();
    /** Cập nhật logo được chọn làm logo hiển thị chính của hệ thống. */
    @Modifying
    @Transactional
    @Query("UPDATE Logo l SET l.isLogo = :isLogo WHERE l.id = :id")
    void updateIsLogo(@Param("id") String id,@Param("isLogo") Boolean isLogo);
}
