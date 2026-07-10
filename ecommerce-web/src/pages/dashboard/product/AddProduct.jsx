import React, { useState } from 'react';
import ProductForm from './ProductForm';
import Modal from '../../../common/alert/Modal';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const titleForm = 'Thêm sản phẩm';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/product/save`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                body: formData
            });
    
            if (response.status === 401) {
                const message = await response.text();
                setResponseText(message);
                openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
                return false;
            }
    
            const responseData = await response.json();
    
            if (responseData && responseData.message === "saved") {
                openModal('Thành công', 'Dữ liệu đã được lưu thành công!', false);
                return true;
            } else {
                openModal('Lỗi', 'Đã xảy ra lỗi khi lưu dữ liệu.', true);
                return false;
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi trong quá trình lưu sản phẩm. Vui lòng thử lại.', true);
            return false;
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

        if (responseText == "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            navigate("/");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <ProductForm
                onSubmit={handleSubmit}
                titleForm={titleForm}
            />
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

export default AddProduct;
