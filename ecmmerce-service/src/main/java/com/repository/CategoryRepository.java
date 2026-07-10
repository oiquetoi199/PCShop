package com.repository;

import com.query.category.CategoryQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.model.Category;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByParentIsNullOrderByPositionAsc();

    Category findByIdAndParentIsNull(String id);

    Category findByIdAndParentIsNotNull(String id);

    List<Category> findByParentIsNotNullOrderByPositionAsc();

    List<Category> findByParent_IdOrderByPositionAsc(String parentId);

    @Query(CategoryQuery.MAX_POSITION)
    String findMaxPosition();
}
