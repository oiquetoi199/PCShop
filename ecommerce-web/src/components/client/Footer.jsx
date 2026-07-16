import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoHomeOutline } from "react-icons/io5";
import { FaTiktok, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

// Hiển thị thông tin doanh nghiệp, logo và chính sách ở cuối trang.
const Footer = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [logo, setLogo] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [company, setCompany] = useState(null);




  useEffect(() => {
    // Gọi API để tải logo chính hiển thị tại phần cuối trang.
    const fetchImages = async () => {
      const response = await fetch(`${apiUrl}/logo/guest/getLogo`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      setLogo(data);
    };

    fetchImages();
  }, [apiUrl]);

  // Chuẩn hóa số điện thoại theo định dạng hiển thị mong muốn.
  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="bg-white rounded-t-3xl"
    >
      <div className="container py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3 lg:max-w-[300px]">
            <img
              src={logo?.imageData && `data:image/jpeg;base64,${logo?.imageData}`}
              alt="Logo"
              className="w-24"
            />
            <p>
              Di động: 0967575881
            </p>
            <p>Email: oiquetoi199@gmail.com</p>
            {/* <div className="mt-6">
              <h3 className="text-lg font-bold text-green-500">Về chúng tôi</h3>
              <ul className="space-y-2 mt-4">
                <li>
                  <Link to="contact-page" className="text-gray-600 hover:text-gray-800 cursor-pointer">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>

          <div>
            {/* <h3 className="text-lg font-bold text-green-500">Chính sách</h3>
            <ul className="space-y-2 mt-4">
              {policy && policy.length > 0 ? (
                policy.map((item) => (
                  <li key={item.id} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                    <Link to={`policy-detail/${item.id}`} className="text-gray-600 hover:text-gray-800 cursor-pointer">
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-600">Chưa có thông tin chính sách</li>
              )}
            </ul> */}
            <div className="mt-6">
              {/* <h3 className="text-lg font-bold text-green-500">Các mạng xã hội</h3> */}
              <div className="flex items-center space-x-6 mt-4">
                {/* <a href={company?.linkTiktok || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black text-2xl">
                  <FaTiktok size={60} className="text-gray-600 hover:text-black" />
                </a>
                <a href={company?.linkPageFb || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-2xl">
                  <FaFacebook size={60} className="text-blue-500 hover:text-blue-700" />
                </a> */}
              </div>
            </div>
          </div>

          <div>
            <div className="p-4 rounded-md">
              <h1 className="text-xl font-semibold flex items-center text-green-500 space-x-2">
                <IoHomeOutline />
                <span>TLaptop</span>
              </h1>
              <p className="mt-2">
                Họ và tên: Đỗ Văn Trường
              </p>
              <p className="mt-2">
                MSV: B22DTCN157
              </p>
              {/* <div className="w-full h-64 rounded-md overflow-hidden border border-gray-300 mt-2">
                <iframe
                  src={company?.linkMap}
                  className="w-full h-full"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
