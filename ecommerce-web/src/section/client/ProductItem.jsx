import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatLargeNumber } from "../../utils/FormatUtils";
import { FaCaretSquareRight } from 'react-icons/fa';

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

// Hiển thị danh sách sản phẩm nổi bật và các thao tác liên quan.
const ProductItem = ({ popularRecipes }) => {
  const navigate = useNavigate();

  // Thêm sản phẩm cần mua và chuyển người dùng đến bước đặt hàng.
  const handleBuyNow = (id) => {
    navigate(`/product-detail/${id}`);
  };

  // Chuyển người dùng đến chức năng liên hệ về sản phẩm.
  const handleContact = (id) => {
    navigate(`/product-contact/${id}`);
  };

  // Mở rộng danh sách hoặc nội dung để hiển thị thêm dữ liệu.
  const handleViewMore = (id) => {
    navigate(`/category-group/${id}`);
  };

  return (
    <div className="container py-5">
      {popularRecipes.map((category) => (
        <div key={category.parentId}>
          <div className="flex items-center mt-8">
            <motion.h1
              viewport={{ once: true }}
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="show"
              className="text-2xl md:text-4xl text-left font-league font-semibold uppercase py-1 mr-4"
            >
              {category.categoryName}
            </motion.h1>
            <motion.hr
              viewport={{ once: true }}
              variants={SlideUp(0.6)}
              initial="hidden"
              whileInView="show"
              className="border-t-2 border-green-300 flex-grow"
            />
          </div>

          {category.popularRecipeDTOS && category.popularRecipeDTOS.length > 0 && (
            <div className="mt-8">
              {category.popularRecipeDTOS.map((subCategory, index) => (
                <div key={subCategory.categoryId}>
                  <div
                    className={`flex items-center justify-between py-2 ${index === 0 ? 'mt-[-50px]' : 'mt-8'}`}
                  >
                    <motion.h2
                      viewport={{ once: true }}
                      variants={SlideUp(0.7)}
                      initial="hidden"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center mt-8">
                    {subCategory.productPopularDTOS.map((item) => (
                      <div key={item.id} className="group space-y-3 text-center bg-white/50 shadow-xl p-3 rounded-xl">
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
                                  <p className="text-5xl text-red-600 line-through">{formatLargeNumber(item.price)}</p>
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductItem;