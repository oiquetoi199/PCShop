package com.repository;

import com.dto.productdto.ProductDetailDTO;
import com.dto.productdto.ProductDetailProjection;
import com.dto.productdto.ProductListDTO;
import com.query.product.ProductQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.model.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    @Query(ProductQuery.queryListAll)
    Page<ProductListDTO> findAllProductsWithCategoryName(Pageable pageable);

    List<Product> findTop3ByCategoryIdOrderByCreateDateDesc(String categoryId);

    Page<Product> findByCategoryIdOrderByCreateDateDesc(String categoryId, Pageable pageable);

    @Query(value = ProductQuery.queryGetBestSale, nativeQuery = true)
    List<ProductDetailProjection> findProductBestSase();

    // Lấy thông tin sản phẩm mới nhất
    @Query(value = "SELECT new com.dto.productdto.ProductDetailDTO(p.id, p.productName, p.productInfo, pi.imageData, p.price, p.isButtonContact, p.saleRate) " +
            "FROM Product p " +
            "JOIN ProductImage pi ON p.id = pi.productId " +
            "ORDER BY p.createDate DESC " +
            "LIMIT 1")
    ProductDetailDTO findProductNew();

    // Tìm kiếm sản phẩm theo category và keyword (tùy chọn), sắp xếp mới nhất.
    @Query("""
        select p from Product p
        where (:categoryId is null or p.categoryId = :categoryId)
          and (:keyword is null or p.productName like concat('%', :keyword, '%'))
        order by p.createDate desc
    """)
    Page<Product> searchProduct(String categoryId, String keyword, Pageable pageable);
}
