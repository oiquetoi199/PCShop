import React, { useEffect, useState } from "react";
import Modal from "../../common/alert/Modal";
import ProductItem from "../../section/client/ProductItem";

// Hiển thị các nhóm sản phẩm nổi bật theo danh mục.
const PopularRecipe = () => {
const apiUrl = import.meta.env.VITE_API_URL;

const [popularRecipes, setPopularRecipes] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalTitle, setModalTitle] = useState('');
const [modalMessage, setModalMessage] = useState('');
const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Gọi API để tải các nhóm sản phẩm nổi bật.
    const fetchPopularRecipes = async () => {
        try {
            const response = await fetch(`${apiUrl}/product/guest/popular-recipe`);
            const data = await response.json();
            setPopularRecipes(data);
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
        }
    };

    fetchPopularRecipes();
  }, []);

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

  return <section>
    <ProductItem popularRecipes={popularRecipes} />
    <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isError={isError}
    />
  </section>
};

export default PopularRecipe;