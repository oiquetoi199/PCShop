import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "../../common/alert/Modal";

const Hero = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [titleStatus, setTitleStatus] = useState("Đang tải hình ảnh...");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${apiUrl}/product-image/guest/banner`);
        const data = await response.json();
        if (data && data.length > 0) {
          setImages(data);
          setTitleStatus("");
        } else {
          setTitleStatus("Không có hình ảnh");
        }
      } catch (error) {
        setTitleStatus("Không có hình ảnh");
        openModal("Lỗi", "Đã xảy ra lỗi khi tải dữ liệu.", true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [apiUrl]);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
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
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[1000px] flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        {isLoading || images.length === 0 ? (
          <div className="absolute w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white text-xl font-bold">{titleStatus}</p>
          </div>
        ) : (
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                key={currentIndex}
                className="absolute w-full h-full"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: "0%" }}
                exit={{ opacity: 0, x: "-100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{ display: "flex", width: "100%" }}
              >
                <img
                  src={`data:image/jpeg;base64,${images[currentIndex].imageData}`}
                  alt={`Slide ${currentIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
        {images.length > 0 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100"
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg opacity-75 hover:opacity-100"
            >
              <FaChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isError={isError}
      />
    </div>
  );
};

export default Hero;
