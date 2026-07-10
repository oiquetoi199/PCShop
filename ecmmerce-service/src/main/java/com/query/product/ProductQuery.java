package com.query.product;

public interface ProductQuery {
    String queryListAll = "SELECT new com.dto.productdto.ProductListDTO(p.id, p.productName, p.productInfo, p.description, p.price, p.saleRate, " +
            "p.isButtonContact, p.initBy, p.updateBy, p.createDate, p.updateDate, p.categoryId, c.categoryName) " +
            "FROM Product p JOIN Category c ON p.categoryId = c.id " +
            "ORDER BY p.createDate DESC";



    // lấy sản phẩm bán đc nhiều nhất và mới nhất
    String queryGetBestSale =
            "SELECT * FROM ( " +
                    "   ( " +
                    "       SELECT  " +
                    "           p.id AS id, " +
                    "           p.product_name AS productName, " +
                    "           pi.image_data AS image, " +
                    "           p.price AS price, " +
                    "           p.is_button_contact AS isButtonContact, " +
                    "           p.sale_rate AS saleRate, " +
                    "           COUNT(op.product_id) AS salesCount, " +
                    "           NULL AS createDate " +
                    "       FROM  " +
                    "           order_product_item op " +
                    "       JOIN  " +
                    "           product p ON op.product_id = p.id " +
                    "       JOIN  " +
                    "           product_image pi ON p.id = pi.product_id " +
                    "       WHERE  " +
                    "           pi.is_thumbnail = 1 " +
                    "       GROUP BY  " +
                    "           p.id, p.product_name, pi.image_data, p.price, p.is_button_contact, p.sale_rate " +
                    "       ORDER BY  " +
                    "           salesCount DESC " +
                    "       LIMIT 3 " +
                    "   ) " +
                    "   UNION ALL " +
                    "   ( " +
                    "       SELECT  " +
                    "           p.id AS id, " +
                    "           p.product_name AS productName, " +
                    "           pi.image_data AS image, " +
                    "           p.price AS price, " +
                    "           p.is_button_contact AS isButtonContact, " +
                    "           p.sale_rate AS saleRate, " +
                    "           NULL AS salesCount, " +
                    "           p.create_date AS createDate " +
                    "       FROM  " +
                    "           product p " +
                    "       JOIN  " +
                    "           product_image pi ON p.id = pi.product_id " +
                    "       WHERE  " +
                    "           pi.is_thumbnail = 1 " +
                    "           AND p.id NOT IN ( " +
                    "               SELECT op.product_id FROM order_product_item op " +
                    "           ) " +
                    "       ORDER BY  " +
                    "           p.create_date DESC " +
                    "       LIMIT 3 " +
                    "   ) " +
                    ") AS t " +
                    "ORDER BY COALESCE(t.salesCount, 0) DESC, t.createDate DESC " +
                    "LIMIT 3";

}
