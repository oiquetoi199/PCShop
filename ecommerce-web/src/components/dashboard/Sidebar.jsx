import React, { useState, useEffect } from 'react';
import { FaBars, FaBook, FaBookReader, FaBuilding, FaCartPlus, FaGavel, FaHome, FaImage, FaInfoCircle, FaList, FaNewspaper, FaPinterest, FaPlus, FaPlusCircle, FaQuestionCircle, FaRegNewspaper, FaSlidersH, FaSort, FaTimes, FaTrademark, FaUser, FaUsers } from 'react-icons/fa';
import { FaCircleMinus } from 'react-icons/fa6';
import { IoAddCircle, IoAlbums, IoListCircle } from 'react-icons/io5';
import { MdOutlineContactPhone } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

// Hiển thị menu điều hướng của khu vực quản trị.
const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({});

    // Mở hoặc thu gọn thanh điều hướng bên.
    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    // Chuyển đổi trạng thái hiển thị của menu.
    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        const menuState = {
            category: path.includes('category'),
            product: path.includes('product'),
            order: path.includes('order'),
            news: path.includes('news'),
            user: path.includes('/user') || path.includes('/contact'),
            banner: path.includes('view'),
            info: path.includes('company-info'),
            policy: path.includes('policy'),
        };

        setOpenMenus(menuState);
    }, [location.pathname]);

    // Kiểm tra đường dẫn hiện tại có khớp với mục điều hướng hay không.
    const isActive = (path) => location.pathname === path;


    return (
        <div className="">
            <div className="md:hidden h-16 p-5 dark:bg-gray-800 dark:text-white text-gray-900 flex justify-between items-center">
                <h1 className="text-xl font-bold hidden sm:block">Menu</h1>
                <button onClick={toggleSidebar} aria-label="Toggle Menu">
                    <FaBars size={24} />
                </button>
            </div>

            <div
                className={`fixed top-0 left-0 h-screen bg-gray-100 text-gray-900 border-r border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white w-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 md:relative md:translate-x-0 md:w-48 lg:w-64 z-50 md:z-0`}
            >
                <div className="p-4 relative">
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 text-white md:hidden"
                    >
                        <FaTimes size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-4">TLaptop</h2>
                    <ul>
                        <li className={`${isActive('/dashboard') ? 'bg-gray-700 text-white' : ''}`}>
                            <Link
                                to="/dashboard"
                                className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <FaHome /> <span>Trang chủ</span>
                            </Link>
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('category')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaBook />
                                    <span>Danh mục</span>
                                </div>
                                <span>{openMenus['category'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['category'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/add-category') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/add-category"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/dashboard/category-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/category-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/dashboard/category-sort') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/category-sort"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaSort /> <span>Sắp xếp</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('product')}
                            >
                                <div className="flex items-center space-x-2">
                                    <IoAlbums />
                                    <span>Sản phẩm</span>
                                </div>
                                <span>{openMenus['product'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['product'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/add-product') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/add-product"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/dashboard/product-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/product-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('order')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaRegNewspaper />
                                    <span>Đơn hàng</span>
                                </div>
                                <span>{openMenus['order'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['order'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/order-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/order-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaCartPlus /> <span>Đặt hàng</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('news')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaNewspaper />
                                    <span>Tin tức</span>
                                </div>
                                <span>{openMenus['news'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['news'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/add-news') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/add-news"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaPlus /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/dashboard/news-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/news-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaList /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li> */}

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('user')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaUsers />
                                    <span>Tài khoản</span>
                                </div>
                                <span>{openMenus['user'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['user'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/user-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/user-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaUser /> <span>Tài khoản</span>
                                        </Link>
                                    </li>
                                    <li className={`${isActive('/dashboard/contact-list') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/contact-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <MdOutlineContactPhone /> <span>Liên hệ</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('banner')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaImage />
                                    <span>Hình ảnh</span>
                                </div>
                                <span>{openMenus['banner'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['banner'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/view-logo') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/view-logo"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaTrademark /> <span>Logo</span>
                                        </Link>
                                    </li>
                                    {/* <li className={`${isActive('/dashboard/view-banner') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/view-banner"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaSlidersH /> <span>Side</span>
                                        </Link>
                                    </li> */}
                                </ul>
                            )}
                        </li>

                        {/* <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('info')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaInfoCircle />
                                    <span>Thông tin</span>
                                </div>
                                <span>{openMenus['info'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['info'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/company-info') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/company-info"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <FaBuilding /> <span>Thông tin công ty</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li> */}

                        {/* <li className="mb-2">
                            <button
                                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center"
                                onClick={() => toggleMenu('policy')}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaGavel />
                                    <span>Chính sách</span>
                                </div>
                                <span>{openMenus['policy'] ? <FaCircleMinus /> : <FaPlusCircle />}</span>
                            </button>
                            {openMenus['policy'] && (
                                <ul className="ml-4 mt-2">
                                    <li className={`${isActive('/dashboard/add-policy') ? 'bg-gray-700 text-white' : ''}`}>
                                        <Link
                                            to="/dashboard/add-policy"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <IoAddCircle /> <span>Thêm</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboard/policy-list"
                                            className="py-2 px-4 rounded hover:bg-gray-700 flex items-center space-x-2"
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                        >
                                            <IoListCircle /> <span>Danh sách</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li> */}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SideBar;