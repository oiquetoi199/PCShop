package com.service;

import com.dto.productdto.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface  ProductService {
    /** Chuyển đổi, kiểm tra và lưu dữ liệu được cung cấp vào cơ sở dữ liệu. */
    void saveData(ProductSaveDTO productSaveDTO) throws Exception;

    /** Lấy danh sách sản phẩm kèm tên danh mục để hiển thị hoặc quản trị. */
    Page<ProductListDTO> findAllProductsWithCategoryName(int page, int size);

    /** Tìm sản phẩm theo mã định danh. */
    ProductDataUpdateDTO findById(String id);

    /** Cập nhật thông tin sản phẩm và các dữ liệu liên quan. */
    void updateProduct(ProductSaveDTO productSaveDTO);

    /** Xóa sản phẩm theo mã định danh. */
    void deleteById(String id);

    /** Lấy danh sách sản phẩm nổi bật, có thể lọc theo danh mục. */
    List<ProductGroupByCategoryDTO> findPopularRecipe();

    /** Lấy thông tin chi tiết của sản phẩm theo mã định danh. */
    ProductDetailDTO findProductDetail(String id);

    /** Lấy danh sách sản phẩm bán chạy dựa trên dữ liệu đơn hàng. */
    List<ProductDetailDTO> findProductBestSale();
    /** Lấy danh sách sản phẩm mới nhất để hiển thị cho người dùng. */
    ProductDetailDTO findProductNew();

    /** Lấy sản phẩm theo danh mục và sắp xếp từ mới đến cũ. */
    Page<PopularRecipeDTO> findByCategoryIdOrderByCreateDateDesc(String categoryId, int page, int size);

    /** Tìm danh mục cha theo mã định danh. */
    ProductGroupByCategoryDTO findByIdAndParentIsNull(String id);

    /** Tìm kiếm sản phẩm theo từ khóa và các điều kiện được cung cấp. */
    Page<PopularRecipeDTO> searchProduct(String categoryId, String keyword, int page, int size);
}
