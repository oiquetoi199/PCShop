import React, { useState, useEffect } from 'react';
import Card from '../../../components/dashboard/Card';
import { FaBox, FaShoppingCart, FaUsers, FaTags, FaNewspaper, FaGavel, FaTrademark, FaSlidersH } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';

// Hiển thị số liệu tổng quan trên trang quản trị.
const Dashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [userTotal, setUserTotal] = useState('');
    const [productTotal, setProductTotal] = useState('');
    const [orderTotal, setOrderTotal] = useState('');
    const [categoryTotal, setcategoryTotal] = useState('');
    const [newsTotal, setNewsTotal] = useState('');
    const [logoTotal, setLogoTotal] = useState('');
    const [policyTotal, setPolicyTotal] = useState('');
    const [slideTotal, setSlideTotal] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để tải các số liệu tổng quan của trang quản trị.
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/user/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.status === 401) {
                    const message = await response.text();
                    setResponseText(message);
                    openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
                    setLoading(false);
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setUserTotal(data.userTotal);
                    setOrderTotal(data.orderTotal);
                    setProductTotal(data.productTotal);
                    setcategoryTotal(data.categoryTotal);
                    setNewsTotal(data.newsTotal);
                    setLogoTotal(data.logoTotal);
                    setPolicyTotal(data.policyTotal);
                    setSlideTotal(data.slideTotal);
                } else {
                    openModal('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    // Mở hộp thoại và thiết lập tiêu đề, nội dung cùng trạng thái hiển thị.
    const openModal = (title, message, error) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsError(error);
        setIsModalOpen(true);
    };
  
    // Đóng hộp thoại và thực hiện xử lý bổ sung sau khi đóng nếu cần.
    const closeModal = () => {
        setIsModalOpen(false);

        if (responseText == "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            navigate("/");
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className='grow p-8'>
                <h2 className='text-2xl mb-4'>Thông tin tổng hợp</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <Card icon={<FaShoppingCart />} title="Đơn hàng" value={orderTotal} link="/dashboard/order-list" />
                    <Card icon={<FaBox />} title="Sản Phẩm" value={productTotal} link="/dashboard/product-list" />
                    <Card icon={<FaUsers />} title="Tài khoản" value={userTotal} link="/dashboard/user-list" />
                    <Card icon={<FaTags />} title="Danh mục" value={categoryTotal} link="/dashboard/category-list" />

                    {/* <Card icon={<FaNewspaper />} title="Tin tức" value={newsTotal} link="/dashboard/news-list" /> */}
                    {/* <Card icon={<FaGavel />} title="Chính sách" value={policyTotal} link="/dashboard/policy-list" /> */}
                    <Card icon={<FaTrademark />} title="Logo" value={logoTotal} link="/dashboard/view-logo" />
                    {/* <Card icon={<FaSlidersH />} title="Slide" value={slideTotal} link="/dashboard/view-banner" /> */}

                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}
                    message={modalMessage}
                    isError={isError}
                />
            </div>
        </LoadingLayout>
    );
};

export default Dashboard;
