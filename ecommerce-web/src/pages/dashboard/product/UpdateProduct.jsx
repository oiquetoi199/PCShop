import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';

// Tải dữ liệu và hiển thị biểu mẫu cập nhật sản phẩm.
const UpdateProduct = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [initialData, setInitialData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const titleForm = 'Cập nhật sản phẩm';
    const [loading, setLoading] = useState(true);

    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Gọi API để tải dữ liệu sản phẩm cần cập nhật.
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}/product/detail/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });
    
                if (response.status === 401) {
                    const message = await response.text();
                    setResponseText(message);
                    openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
                    setInitialData(null);
                    setLoading(false);
                    return;
                }
    
                const data = await response.json();
                setInitialData(data);
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu sản phẩm.', true);
                setInitialData(null);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProductData();
    }, [id]);

    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async (formData) => {
        try {
            // const formDataObj = {};
            // formData.forEach((value, key) => {
            //     formDataObj[key] = value;
            // });

            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/product/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                },
                // body: JSON.stringify(formDataObj),
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
        } finally {
            setLoading(false);
        }
    };
    

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
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                {initialData && (
                    <ProductForm
                        onSubmit={handleSubmit}
                        initialData={initialData}
                        titleForm={titleForm}
                    />
                )}

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

export default UpdateProduct;