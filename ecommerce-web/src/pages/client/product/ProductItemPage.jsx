import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatLargeNumber } from "../../../utils/FormatUtils";
import { useState, useEffect } from 'react';
import Modal from '../../../common/alert/Modal';
import LoadingLayout from '../../../common/loading/LoadingLayout';

// Tạo cấu hình hiệu ứng trượt lên với độ trễ được truyền vào.
const SlideUp = (delay) => {
  return {
    hidden: {
      y: "-100%",
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay,
      },
    },
  };
};

// Hiển thị danh sách sản phẩm của một nhóm danh mục.
const ProductItemPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, keyword, action, statusClick } = location.state || {};

  const [searchState, setSearchState] = useState({
      categoryId: categoryId,
      keyword: keyword,
      action: action,
      statusClick: statusClick,
    });

  const pageSize = 9;

  useEffect(() => {
    if (location.state) {
      setSearchState(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    if (searchState.action === "search") {
      fetchProductsSearch(searchState.categoryId, searchState.keyword, currentPage, pageSize);
    } else {
      fetchProducts(id, currentPage, pageSize)
    }
  }, [id, currentPage, pageSize, searchState.statusClick]);

  // Gọi API để tải danh sách sản phẩm.
  const fetchProducts = async (id, page = 0, size = pageSize) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/product/guest/products/${id}?page=${page}&size=${size}`);
      const data = await response.json();

      setProducts(data.content || []);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API để tìm kiếm sản phẩm theo từ khóa và bộ lọc.
  const fetchProductsSearch = async (categoryId, keyword, page = 0, size = pageSize) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/product/guest/search?categoryId=${categoryId}&keyword=${keyword}&page=${page}&size=${size}`);
      const data = await response.json();

      setProducts(data.content || []);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
    } finally {
      setLoading(false);
    }
  };

  // Mở hộp thoại và thiết lập tiêu đề, nội dung cùng trạng thái hiển thị.
  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  // Đóng hộp thoại và thực hiện xử lý bổ sung sau khi đóng nếu cần.
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Thêm sản phẩm cần mua và chuyển người dùng đến bước đặt hàng.
  const handleBuyNow = (id) => {
    navigate(`/product-detail/${id}`);
  };

  // Cập nhật trang hiện tại và tải dữ liệu của trang được chọn.
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Chuyển người dùng đến chức năng liên hệ về sản phẩm.
  const handleContact = (id) => {
    navigate(`/product-contact/${id}`);
  };

  return (
    <LoadingLayout loading={loading}>
      {Array.isArray(products) && products.length > 0 ? (
        products.map((category) => (
          <div key={Math.random()} style={{ backgroundColor: category.categoryColor }}>
            <div className="container py-1">
              <motion.h1
                variants={SlideUp(0.5)}
                initial="hidden"
                whileInView="show"
                className="text-2xl md:text-4xl text-center font-league font-semibold uppercase py-1 mt-5"
                viewport={{ once: true }}
              >
                {category.categoryName}
              </motion.h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center mt-8">
                {Array.isArray(category.productPopularDTOS) && category.productPopularDTOS.length > 0 ? (
                  category.productPopularDTOS.map((item) => (
                    <div className="group space-y-3 text-center bg-white/50 shadow-xl p-3 rounded-xl" key={item.id}>
                      <img
                        src={`data:image/jpeg;base64,${item.image}`}
                        alt={item.productName}
                        className="w-[350px] h-[240px] object-cover mx-auto img-shadow group-hover:scale-110 group-hover:translate-y-[-10px] transition-all duration-700 rounded-md"
                      />
                      <div>
                        {
                          item.isButtonContact == 'Y' ? (
                            <button
                              className="btn-primary mb-1 md:opacity-0 md:group-hover:opacity-100 opacity-100"
                              onClick={() => handleContact(item.id)}
                            >
                              Liên hệ
                            </button>
                          ) : (
                            <button
                              className="btn-primary mb-1 md:opacity-0 md:group-hover:opacity-100 opacity-100"
                              onClick={() => handleBuyNow(item.id)}
                            >
                              Mua ngay
                            </button>
                          )}

                        <div className="grid place-items-center">
                          <p className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[180px] md:max-w-[220px] text-center block">
                            {item.productName}
                          </p>
                        </div>

                        {
                          item.isButtonContact == 'Y' ? (
                            <div className="flex gap-2 justify-center">
                              <p className="text-xl font-bold text-green-500">Liên hệ ngay</p>
                            </div>
                          ) : (
                            item.newPrice > 0 ? (
                              <div className="flex gap-2 justify-center">
                                <p className="text-xl font-bold text-green-500">{formatLargeNumber(item.newPrice)}</p>
                                <p className="text-xl text-red-600 line-through">{formatLargeNumber(item.price)}</p>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-center">
                                <p className="text-xl font-bold text-green-500">{formatLargeNumber(item.price)}</p>
                              </div>
                            )
                          )
                        }

                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-center">Không có sản phẩm trong danh mục này.</p>
                )}
              </div>

              <motion.hr
                variants={SlideUp(0.5)}
                initial="hidden"
                whileInView="show"
                className="border-t-2 border-green-300 mt-10"
                viewport={{ once: true }}
              />
        
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalTitle}
                message={modalMessage}
                isError={isError}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">Không có sản phẩm.</p>
      )}
      <div className="pagination mt-5 mb-5 flex justify-center items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 0}
          className="btn-primary"
        >
          Trước
        </button>
        <span className="mx-4">{currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="btn-primary"
        >
          Tiếp theo
        </button>
      </div>
    </LoadingLayout>
  );
};

export default ProductItemPage;