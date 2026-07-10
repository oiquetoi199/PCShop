package com.query.category;


public interface CategoryQuery {
    // lấy cấp danh mục
    String MAX_POSITION = "SELECT MAX(c.position) FROM Category c";
}
