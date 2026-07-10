import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../common/alert/Modal";
import LoadingLayout from "../../../common/loading/LoadingLayout";
import { motion } from 'framer-motion';
import { FaCaretSquareRight } from "react-icons/fa";
import { formatLargeNumber } from "../../../utils/FormatUtils";

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

const ProductByCategoryGroupPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [productByCategoryGroup, setProductByCategoryGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await fetch(`${apiUrl}/product/guest/popular-recipe-category/${id}`);
        const data = await response.json();
        setProductByCategoryGroup(data);
      } catch (error) {
        openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularRecipes();
  }, [id]);

  const handleBuyNow = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const handleContact = (id) => {
    navigate(`/product-contact/${id}`);
  };

  const handleViewMore = (id) => {
    navigate(`/category-group/${id}`);
  };

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <LoadingLayout loading={loading}>
      {productByCategoryGroup && (
        <div className="min-h-screen pb-16" style={{ backgroundColor: productByCategoryGroup.categoryColor }}>
          <div className="container py-1">
            <div className="flex items-center mt-10">
              <motion.h1
                variants={SlideUp(0.5)}
                viewport={{ once: true }}
                initial="hidden"
                whileInView="show"
                className="text-2xl md:text-4xl text-left font-league font-semibold uppercase py-1 mr-4"
              >
                {productByCategoryGroup.categoryName}
              </motion.h1>
              <motion.hr
                variants={SlideUp(0.6)}
                initial="hidden"
                viewport={{ once: true }}
                whileInView="show"
                className="border-t-2 border-green-300 flex-grow"
              />
            </div>
            {productByCategoryGroup.popularRecipeDTOS && productByCategoryGroup.popularRecipeDTOS.length > 0 ? (
              <div className="mt-8">
                {productByCategoryGroup.popularRecipeDTOS.map((subCategory, index) => (
                  <div key={subCategory.categoryId}>
                    <div
                      className={`flex items-center justify-between py-2 ${index === 0 ? 'mt-[-50px]' : 'mt-8'}`}
                    >
                      <motion.h2
                        variants={SlideUp(0.7)}
                        initial="hidden"
                        viewport={{ once: true }}
                        whileInView="show"
                        className="text-xl md:text-3xl font-semibold mx-auto"
                      >
                        {subCategory.categoryName}
                      </motion.h2>
                      <button
                        onClick={() => handleViewMore(subCategory.categoryId)}
                        className="flex items-center text-green-500 font-medium hover:text-green-700 transition duration-300"
                      >
                        Xem thêm <FaCaretSquareRight className="ml-1" />
                      </button>
                    </div>
                    {subCategory.productPopularDTOS && subCategory.productPopularDTOS.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center mt-8">
                        {subCategory.productPopularDTOS.map((item) => (
                          <div key={item.id} className="group space-y-3 text-center bg-white/50 shadow-xl p-3 rounded-xl">
                            <img
                              src={`data:image/jpeg;base64,${item.image}`}
                              alt="Product"
                              className="w-[350px] h-[240px] object-cover mx-auto img-shadow group-hover:scale-110 group-hover:translate-y-[-10px] transition-all duration-700 rounded-md"
                            />
                            <div>
                              {item.isButtonContact == 'Y' ? (
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

                              {item.isButtonContact == 'Y' ? (
                                <div className="flex gap-2 justify-center">
                                  <p className="text-xl font-bold text-green-500">Liên hệ ngay</p>
                                </div>
                              ) : item.newPrice > 0 ? (
                                <div className="flex gap-2 justify-center">
                                  <p className="text-xl font-bold text-green-500">{formatLargeNumber(item.newPrice)}</p>
                                  <p className="text-xl text-red-600 line-through">{formatLargeNumber(item.price)}</p>
                                </div>
                              ) : (
                                <div className="flex gap-2 justify-center">
                                  <p className="text-xl font-bold text-green-500">{formatLargeNumber(item.price)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-8 text-center text-xl font-semibold text-gray-700">
                        Không có sản phẩm nào
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-8 text-center text-xl font-semibold text-gray-700">
                Không có sản phẩm nào
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isError={isError}
      />
    </LoadingLayout>
  );
};

export default ProductByCategoryGroupPage;