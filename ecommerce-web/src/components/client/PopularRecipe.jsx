import React, { useEffect, useState } from "react";
import Modal from "../../common/alert/Modal";
import ProductItem from "../../section/client/ProductItem";

const PopularRecipe = () => {
const apiUrl = import.meta.env.VITE_API_URL;

const [popularRecipes, setPopularRecipes] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalTitle, setModalTitle] = useState('');
const [modalMessage, setModalMessage] = useState('');
const [isError, setIsError] = useState(false);

  useEffect(() => {
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

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

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