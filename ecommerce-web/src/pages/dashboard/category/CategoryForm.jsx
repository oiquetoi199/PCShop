import React, { useEffect, useState } from 'react';
import Input from '../../../common/input/Input';
import Button from '../../../common/button/Button';
import Select from '../../../common/select/Select';
import Modal from '../../../common/alert/Modal';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate } from 'react-router-dom';

const CategoryForm = ({ onSubmit, initialData, titleForm }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState(initialData || { categoryName: "", parentId: "", color: "" });
    const [errors, setErrors] = useState({ categoryName: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);  

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/category/find-parent`, {
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

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu danh mục.', true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const validate = () => {
        const newErrors = { categoryName: '' };

        if (!formData.categoryName) {
            newErrors.categoryName = 'Tên danh mục không được để trống.';
        }

        if (formData.categoryName.length > 50) {
            newErrors.categoryName = 'Tên danh mục không được quá 50 ký tự.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
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

    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);
            const success = await onSubmit(formData);
            
            setLoading(false);

            if (success) {
                await fetchCategories();
                handleReset();
            }
        }
    };

    const handleReset = () => {
        setFormData({ categoryName: '', parentId: '', color: '' });
        setErrors({ categoryName: '' });
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="flex justify-center items-center min-h-screen w-full">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl mb-4 text-center text-gray-900 dark:text-white">{titleForm}</h2>
                    <Input
                        id="category"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        error={errors.categoryName}
                        placeholder="Nhập tên danh mục"
                        label="Tên danh mục"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                    />

                    <Select
                        id="parentId"
                        name="parentId"
                        value={formData.parentId || ''}
                        onChange={handleChange}
                        error={errors.parentId}
                        options={categories}
                        placeholder="Chọn danh mục cha (nếu có)"
                        label="Danh mục cha"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                        optionLabelKey="categoryName"
                    />
                    
                    <Input
                        id="color"
                        name="color"
                        value={formData.color || "#ffffff"}
                        onChange={handleChange}
                        error={errors.color}
                        label="Màu sắc"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2 h-10"
                        type="color"
                    />

                    <div className="flex justify-between mt-4 gap-2">
                        <Button
                            onClick={handleSubmit}
                            className={`bg-blue-600 dark:bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                        <Button
                            onClick={() => {
                                handleReset();
                                closeModal();
                            }}
                            className="ml-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                            Hủy
                        </Button>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        title={modalTitle}
                        message={modalMessage}
                        isError={isError}
                    />
                </div>
            </div>
        </LoadingLayout>
    );
};

export default CategoryForm;
