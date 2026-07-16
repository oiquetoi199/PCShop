package com.repository;

import com.query.category.CategoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    /** Lấy danh sách danh mục cha theo thứ tự vị trí tăng dần. */
    List<Category> findByParentIsNullOrderByPositionAsc();

    /** Tìm danh mục cha theo mã định danh. */
    Category findByIdAndParentIsNull(String id);

    /** Tìm danh mục con theo mã định danh. */
    Category findByIdAndParentIsNotNull(String id);

    /** Lấy danh sách danh mục con theo thứ tự vị trí tăng dần. */
    List<Category> findByParentIsNotNullOrderByPositionAsc();

    /** Lấy danh sách danh mục con của một danh mục cha theo thứ tự vị trí tăng dần. */
    List<Category> findByParent_IdOrderByPositionAsc(String parentId);

    /** Tìm giá trị lớn nhất liên quan đến danh mục để phục vụ sắp xếp hoặc tạo mới. */
    @Query(CategoryQuery.MAX_POSITION)
    String findMaxPosition();
}
