import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { formatLargeNumber } from "../../utils/FormatUtils";

// Tạo cấu hình hiệu ứng trượt lên/
const SlideUp = (delay) => {
  return {
    hidden: {
      x: "-100%",
      opacity: 0,
    },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay
      }
    }
  }
};

// Hiển thị danh sách sản phẩm bán chạy trên trang chủ.
const HotDessert = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API để tải danh sách sản phẩm bán chạy.
    const fetchnewsList = async () => {
      const response = await fetch(`${apiUrl}/product/guest/product-best-sale`);
      const data = await response.json();
      setProducts(data);
    };

    fetchnewsList();
  }, []);

  return (
    <section>
      <div className="container py-5">
        <motion.h3
          variants={SlideUp(0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-semibold text-darkGreen uppercase mb-8">
          BÁN CHẠY NHẤT - NỔI BẬT NHẤT
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
          {products ? products.map((item, index) => {
            return (
              <motion.div
                variants={SlideUp(index * 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="group bg-white/50 p-1 shadow-md items-center gap-3 cursor-pointer flex flex-col justify-center"
                key={item.id}
              >
                <Link to={item.isButtonContact === 'Y' ? `/product-contact/${item.id}` : `/product-detail/${item.id}`}>
                  <motion.img
                    src={`data:image/png;base64,${item.image}`}
                    alt={item.productName}
                    className="object-cover w-full h-40 max-h-40 aspect-[16/8] rounded-md"
                    whileHover={{ scale: 1.2 }}
                  />
                
                  <div className="mt-3 text-center">
                    <div className="grid place-items-center">
                      <h3 className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[180px] md:max-w-[220px] text-center block">{item.productName}</h3>
                    </div>
                    {
                      item.isButtonContact === 'Y' ? (
                        <div className="flex gap-2 justify-center">
                          <p className="text-lg md:text-xl font-bold text-green-500">Liên hệ ngay</p>
                        </div>
                      ) : (
                        item.newPrice > 0 ? (
                          <div className="flex flex-col md:flex-row gap-2 justify-center">
                            <p className="text-lg md:text-xl font-bold text-green-500">{formatLargeNumber(item.newPrice)}</p>
                            <p className="text-lg md:text-xl text-red-600 line-through">{formatLargeNumber(item.price)}</p>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center">
                            <p className="text-lg md:text-xl font-bold text-green-500">{formatLargeNumber(item.price)}</p>
                          </div>
                        )
                      )
                    }
                  </div>
                </Link>
              </motion.div>

            );
          }) : (
            <p className="text-center col-span-3">Không có sản phẩm nào để hiển thị.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotDessert;
