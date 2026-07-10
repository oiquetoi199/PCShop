import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaClipboardList, FaSignOutAlt, FaCaretDown, FaCaretUp, FaSignInAlt, FaCog } from "react-icons/fa";
import Modal from "../../common/alert/Modal";

const Navbar = ({ handleLoginPopup, username, setUsername }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [logo, setLogo] = useState(null);
  const [submenus, setSubMeus] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isManagementHovered, setIsManagementHovered] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchValidateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token || token.trim() === "") {
        return false;
      }

      try {
        const response = await fetch(`${apiUrl}/auth/validate-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const responseData = await response.json();

        if (!response.ok || responseData.message === "expired" || responseData.message === "error") {
          openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
          return false;
        }
      } catch (error) {
        openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
        return false;
      }
    };

    fetchValidateToken();
  }, [apiUrl]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch(`${apiUrl}/logo/guest/getLogo`);
      if (response.ok) {
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        setLogo(data);
      } else {
        setLogo(null);
      }
    };

    fetchImages();
  }, [apiUrl]);

  useEffect(() => {
    const fetchSubMenus = async () => {
      const response = await fetch(`${apiUrl}/category/guest/find-parent`);
      const data = await response.json();
      setSubMeus(data);
    };
    fetchSubMenus();
  }, []);

  useEffect(() => {
    const storedRoles = localStorage.getItem("roles");
    if (storedRoles) {
      setRoles(storedRoles.split(","));
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");

    setUsername("");
    setRoles([]);
    navigate("/");
  };

  const onCart = () => {
    const token = localStorage.getItem('token');
    if (!token || token.trim() === "") {
      openModal('Thông báo', 'Vui lòng đăng nhập.', true);
    } else {
      navigate("/cart-product");
    }
  };

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handleLogout();
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          {logo && (
            <img
              src={`data:image/jpeg;base64,${logo.imageData}`}
              alt="Logo"
              className="w-16 h-16 cursor-pointer"
              onClick={() => { navigate("/") }}
            />
          )}
          <Link to="/" className="text-green-600 text-lg hover:text-blue-600 font-medium">
            TLaptop
          </Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden lg:flex flex-1 justify-center space-x-8">
          <Link to="/" className="text-green-600 hover:text-gray-600 font-medium text-xl">
            Trang chủ
          </Link>

          {/* Product Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsProductHovered(true)} // Show on hover
            onMouseLeave={() => setIsProductHovered(false)} // Hide on mouse leave
          >
            <button className="text-green-600 hover:text-gray-600 font-medium text-xl flex items-center">
              Danh mục
              <FaCaretDown className="ml-0 group-hover:hidden" />
              <FaCaretUp className="ml-0 hidden group-hover:inline-block" />
            </button>

            {isProductHovered && submenus.length > 0 && (
              <div className="absolute left-0 mt-0 w-40 bg-white shadow-md rounded-md opacity-100 transition-opacity z-50">
                {submenus.map((submenu, index) => (
                  <Link
                    key={index}
                    to={`/product-category-group/${submenu.id}`}
                    className="block px-4 py-2 text-green-600 hover:bg-gray-100 font-medium"
                  >
                    {submenu.categoryName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* <Link to="news-list" className="text-green-600 hover:text-gray-600 font-medium text-xl">
            Tin tức
          </Link> */}

          <Link to="contact-page" className="text-green-600 hover:text-gray-600 font-medium text-xl">
            Liên hệ
          </Link>

        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <button className="text-green-600 hover:text-gray-600 font-medium text-xl flex items-center" onClick={onCart}>
            <FaShoppingCart className="w-6 h-6 mr-2" />
          </button>

          {username ? (
            <div className="relative group flex items-center"
              onMouseEnter={() => setIsManagementHovered(true)} // Show on hover
              onMouseLeave={() => setIsManagementHovered(false)} // Hide on mouse leave
            >
              <FaUser className="text-green-600 w-6 h-6 mr-2" />
              <button className="text-green-600 hover:text-gray-600 font-medium text-xl flex items-center">
                {username}
                <FaCaretDown className="ml-0 group-hover:hidden" />
                <FaCaretUp className="ml-0 hidden group-hover:inline-block" />
              </button>
              {
                isManagementHovered && (
                  <div className="absolute left-0 top-full mt-0 w-40 bg-white shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {
                      roles.includes("ADMIN") && (
                        <Link to="dashboard" className="flex px-4 py-2 text-green-600 hover:bg-gray-100 items-center font-medium">
                          <FaCog className="mr-2" /> Quản lý
                        </Link>
                      )
                    }

                    <Link to="user-info" className="flex px-4 py-2 text-green-600 hover:bg-gray-100 items-center font-medium">
                      <FaUser className="mr-2" /> Tài khoản
                    </Link>
                    <Link to="my-orders" className="flex px-4 py-2 text-green-600 hover:bg-gray-100 items-center font-medium">
                      <FaClipboardList className="mr-2" /> Đơn hàng
                    </Link>
                    <button onClick={handleLogout} className="w-full flex px-4 py-2 text-green-600 hover:bg-gray-100 items-center font-medium">
                      <FaSignOutAlt className="mr-2" /> Đăng xuất
                    </button>
                  </div>
                )
              }

            </div>
          ) : (
            <button
              className="text-green-600 hover:text-gray-600 font-medium text-xl flex items-center"
              onClick={handleLoginPopup}
            >
              <FaSignInAlt className="w-6 h-6 mr-2" />
              Đăng nhập
            </button>
          )}

        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          <button type="button" className="text-black hover:text-blue-600 focus:outline-none" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white text-green-600 space-y-4 px-4 py-2 absolute top-16 left-0 w-full shadow-lg">
          <Link to="/" className="block hover:text-gray-600" onClick={toggleMobileMenu}>
            Trang chủ
          </Link>

          <div>
            <button
              className="w-full text-left hover:text-gray-600 flex justify-between items-center"
              onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
            >
              Sản phẩm
              {isProductDropdownOpen ? <FaCaretUp className="ml-0" /> : <FaCaretDown className="ml-0" />}
            </button>

            {isProductDropdownOpen && submenus.length > 0 && (
              <div className="ml-4">
                {submenus.map((submenu, index) => (
                  <Link
                    key={index}
                    to={`/product-category-group/${submenu.id}`}
                    className="block px-4 py-2 hover:text-gray-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {submenu.categoryName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="news-list" className="block hover:text-gray-600" onClick={toggleMobileMenu}>
            Tin tức
          </Link>

          <Link to="contact-page" className="block hover:text-gray-600" onClick={toggleMobileMenu}>
            Liên hệ
          </Link>

          <button className="block hover:text-gray-600" onClick={() => { toggleMobileMenu(); onCart() }}>
            Giỏ hàng
          </button>

          {
            username ? (
              <div>
                <button
                  className="w-full text-left hover:text-gray-600 flex items-center justify-between"
                  onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}
                >
                  {username}
                  {isManagementDropdownOpen ? <FaCaretUp className="ml-0" /> : <FaCaretDown className="ml-0" />}
                </button>
                {isManagementDropdownOpen && (
                  <div className="ml-4">
                    {
                      roles.includes("ADMIN") && (
                        <Link to="dashboard" className="block px-4 py-2 hover:text-gray-600" onClick={toggleMobileMenu}>
                          Quản lý
                        </Link>
                      )
                    }
                    <Link to="user-info" className="block px-4 py-2 hover:text-gray-600" onClick={toggleMobileMenu}>
                      Tài khoản
                    </Link>
                    <Link to="my-orders" className="block px-4 py-2 hover:text-gray-600" onClick={toggleMobileMenu}>
                      Đơn hàng
                    </Link>
                    <button className="block px-4 py-2 hover:text-gray-600" onClick={() => { toggleMobileMenu(); handleLogout() }}>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) :
              (
                <button className="block hover:text-gray-600" onClick={handleLoginPopup}>
                  Đăng nhập
                </button>
              )
          }

        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        isError={isError}
      />

    </nav>
  );
};

export default Navbar;