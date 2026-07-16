import React, { useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../../common/alert/Modal';

// Tải dữ liệu và hiển thị biểu mẫu cập nhật danh mục.
const UpdateCategory = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();

    const titleForm = 'Cập nhật danh mục';
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        // Gọi API để tải thông tin danh mục cần chỉnh sửa.
        const fetchCategory = async () => {
            try {
                const response = await fetch(`${apiUrl}/category/detail/${id}`, {
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
                    setInitialData(data);
                } else {
                    openModal('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.', true);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCategory();
    }, [id]);
    
    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async (formData) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${apiUrl}/category/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify({ id: id, ...formData }),
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
            openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật dữ liệu. Vui lòng thử lại.', true);
            return false;
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
            <div className="flex justify-center items-center min-h-screen w-full bg-gray-100 dark:bg-gray-900">
                {initialData && (
                    <CategoryForm
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

export default UpdateCategory;

