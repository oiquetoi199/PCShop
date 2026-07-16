import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeCotext } from '../../context/ThemeContextProvider';

// Hiển thị thanh điều hướng và các thao tác tài khoản, tìm kiếm, giỏ hàng.
const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeCotext);
    const navigate = useNavigate();

    // Xóa thông tin đăng nhập cục bộ và đưa người dùng về trạng thái chưa xác thực.
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        navigate("/");
    };

    return (
        <div className="w-full px-4 h-16 flex justify-between items-center border-gray-300 dark:border-gray-600 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white shadow-md z-40">
            <Link to="/" className="flex items-center text-lg font-bold space-x-2">
                <FaHome size={20} />
                <span className="hidden md:inline">Trang chính</span>
            </Link>

            <div className="flex items-center space-x-4">
                {/* <button className="text-xl" onClick={toggleTheme}>
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </button> */}
                <button className="flex items-center space-x-2 text-lg" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span className="hidden md:inline">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;

