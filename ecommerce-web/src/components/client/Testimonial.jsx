import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import TextWithExpandHTML from '../../common/text-expand/TextWithExpandHTML';
import { FaCheck } from 'react-icons/fa';

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
        delay: delay
      }
    }
  }
};

// Hiển thị sản phẩm mới nhất trên trang chủ.
const Testimonial = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để tải sản phẩm mới nhất trên hệ thống.
    const fetchProductDetail = async () => {
      const response = await fetch(`${apiUrl}/product/guest/product-new`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      setProduct(data);
    };

    fetchProductDetail();
  }, [apiUrl]);

  // Hiển thị ngay nội dung hoặc mục đang được chọn.
  const handleShowNow = (id) => {
    navigate(`/product-detail/${id}`);
  };

  // Chuyển người dùng đến chức năng liên hệ về sản phẩm.
  const handleContact = (id) => {
    navigate(`/product-contact/${id}`);
  };

  return <section>
    <div className="container mt-10">
      {
        product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center">
            <div className="space-y-5 lg:max-w-[400px]">
              <h1 className="flex items-center text-3xl font-bold text-green-500 mb-8">
                <FaCheck className="mr-2" /> Sản phẩm mới
              </h1>
              <motion.h1
                variants={SlideUp(0.4)}
                initial="hidden"
                whileInView="show"
                className="text-xl md:text-5xl uppercase font-semibold font-league mt-2 sm:mt-4"
                viewport={{ once: true }}
              >
                {product.productName}
              </motion.h1>
              <motion.p
                variants={SlideUp(0.7)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <TextWithExpandHTML text={product.productInfo} maxLength={200} />
              </motion.p>
              {
                product.isButtonContact == 'Y' ? (
                  <motion.button
                    variants={SlideUp(1)}
                    initial="hidden"
                    whileInView="show"
                    className="btn-primary"
                    viewport={{ once: true }}
                    onClick={() => handleContact(product.id)}
                  >
                    Liên hệ ngay
                  </motion.button>
                ) : (
                  <motion.button
                    variants={SlideUp(1)}
                    initial="hidden"
                    whileInView="show"
                    className="btn-primary"
                    viewport={{ once: true }}
                    onClick={() => handleShowNow(product.id)}
                  >
                    Xem ngay
                  </motion.button>
                )
              }
            </div>
            <div className="relative flex justify-center items-center">
              <img
                src={`data:image/png;base64,${product.image}`}
                alt={product.productName}
                className="relative z-10 w-[400px] sm:h-[500px] sm:w-[500px] lg:max-w-[500px] img-shadow bg-transparent rounded-2xl"
              />
            </div>
          </div>
        )
      }
    </div>
  </section>
};

export default Testimonial;