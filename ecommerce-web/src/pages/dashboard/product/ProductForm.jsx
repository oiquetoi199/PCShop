import React, { useState, useEffect } from 'react';
import Input from '../../../common/input/Input';
import Select from '../../../common/select/Select';
import Button from '../../../common/button/Button';
import Modal from '../../../common/alert/Modal';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import ImageUpload from '../../../common/input/ImageUpload';
import { useNavigate } from 'react-router-dom';
import CheckBox from '../../../common/input/CheckBox';
import CustomQuillEditorText from '../../../common/input/CustomQuillEditorText';

// Hiển thị biểu mẫu thêm hoặc cập nhật sản phẩm và quản lý dữ liệu nhập.
const ProductForm = ({ onSubmit, initialData, titleForm }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({ id: "", productName: "", price: "", saleRate: "", description: "", productInfo: "", categoryId: "", images: [], isButtonContact: false });
    const [categories, setCategories] = useState([]);
    const [productTypes, setProductTypes] = useState([""]);
    const [errors, setErrors] = useState({ productName: "", price: "", saleRate: "", description: "", productInfo: "", categoryId: "", images: "", isButtonContact: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (initialData) {
            if (initialData.product) {
                setFormData({
                    id: initialData.product.id,
                    productName: initialData.product.productName || "",
                    price: String(initialData.product.price) || "",
                    saleRate: String(initialData.product.saleRate) || "",
                    description: initialData.product.description || "",
                    productInfo: initialData.product.productInfo || "",
                    categoryId: initialData.product.categoryId || "",
                    isButtonContact: initialData.product.isButtonContact === "Y" ? true : false,
                    initBy: initialData.product.initBy || "",
                    updateBy: initialData.product.updateBy || "",
                    createDate: initialData.product.createDate || "",
                    updateDate: initialData.product.updateDate || ""
                });
            }

            if (initialData.productTypes) {
                const productTypeNames = initialData.productTypes.map((type) => type.name);
                setProductTypes(productTypeNames);
            }
        }
    }, [initialData]);

    useEffect(() => {
        // Gọi API để tải danh sách danh mục và cập nhật dữ liệu lựa chọn.
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/category/find-child`, {
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

        fetchCategories();
    }, []);


    // Cập nhật state khi giá trị của trường nhập liệu thay đổi.
    const handleChange = (event) => {
        const { name, value, files, checked } = event.target;

        if (files) {
            // Filter only image files
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

            const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB
            
            if (oversizedFiles.length > 0) {
                errors.images = "Chỉ được chọn các tệp ảnh có kích thước tối đa 5MB.";
                setErrors(errors);
            } else if (imageFiles.length !== files.length) {
                errors.images = "Chỉ được chọn các tệp ảnh (jpg, png, gif, ...)";
                setErrors(errors);
            } else {
                setFormData({
                    ...formData,
                    images: [...formData.images, ...imageFiles], // Append new image files
                });
                errors.images = "";
                setErrors(errors);
            }
        } else if (name === "isButtonContact") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    // Cập nhật thông tin chi tiết sản phẩm trong biểu mẫu.
    const handleChangeProductInfo = (e) => {
        setFormData(prev => ({ ...prev, productInfo: e.target.value }));
    };

    // Cập nhật nội dung mô tả sản phẩm trong biểu mẫu.
    const handleChangeDescription = (e) => {
        setFormData(prev => ({ ...prev, description: e.target.value }));
    };

    // Loại bỏ hình ảnh được chọn khỏi dữ liệu hiện tại.
    const handleRemoveImage = (indexToRemove) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, index) => index !== indexToRemove), // Remove image by index
        });
    };

    // Kiểm tra dữ liệu người dùng nhập trước khi tiếp tục xử lý.
    const validate = () => {
        const newErrors = { productName: '', price: '', saleRate: '', description: '', productInfo: '', categoryId: '', images: '', isButtonContact: '' };

        if (!formData.productName) {
            newErrors.productName = 'Tên sản phẩm không được để trống.';
        }

        if (formData.productName.length > 1000) {
            newErrors.productName = 'Tên sản phẩm không được quá 1000 ký tự.';
        }

        if (!formData.productInfo) {
            newErrors.productInfo = 'Thông tin sản phẩm không được để trống.';
        }

        if (formData.productInfo.length > 2000) {
            newErrors.productInfo = 'Thông tin sản phẩm không được quá 2000 ký tự.';
        }

        if (!formData.description) {
            newErrors.description = 'Mô tả sản phẩm không được để trống.';
        }

        if (formData.description.length > 5000) {
            newErrors.description = 'Mô tả sản phẩm không được quá 5000 ký tự.';
        }

        if (!formData.isButtonContact && (!formData.price || isNaN(formData.price) || formData.price > 1000000000000000)) {
            newErrors.price = 'Giá sản phẩm không hợp lệ.';
        }

        if (formData.isButtonContact || !formData.price) {
            formData.price = 0;
        }

        if (formData.saleRate && (isNaN(formData.saleRate) || formData.saleRate < 0 || formData.saleRate > 100)) {
            newErrors.saleRate = 'Giảm giá phải là một số hợp lệ từ 0 đến 100.';
        }

        if (formData.isButtonContact || !formData.saleRate) {
            formData.saleRate = 0;
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Danh mục sản phẩm không được để trống.';
        }

        if (!initialData && formData.images.length === 0) {
            newErrors.images = 'Ảnh sản phẩm không được để trống.';
        }

        if (!initialData && formData.images.length > 10) {
            newErrors.images = 'Không được tải lên quá 10 tệp ảnh.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
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

    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);
            const formDataToSubmit = new FormData();

            if (initialData) {
                formDataToSubmit.append("id", formData.id);
            }

            formDataToSubmit.append("productName", formData.productName);
            formDataToSubmit.append("productInfo", formData.productInfo);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("price", formData.price);
            formDataToSubmit.append("saleRate", formData.saleRate);
            formDataToSubmit.append("categoryId", formData.categoryId);
            formDataToSubmit.append("isButtonContact", formData.isButtonContact ? "Y" : "N");
            
            if (initialData) {
                formDataToSubmit.append("initBy", formData.initBy);
                formDataToSubmit.append("createDate", formData.createDate);
            }

            if (!initialData) {
                formData.images.forEach((image, index) => {
                    formDataToSubmit.append(`images[${index}]`, image);
                });
            }

            formDataToSubmit.append("productTypes", productTypes);

            const success = await onSubmit(formDataToSubmit);

            if (success && !initialData) {
                handleReset();
            }
            setLoading(false);
        }
    };

    // Đặt lại dữ liệu biểu mẫu về trạng thái ban đầu.
    const handleReset = () => {
        setFormData({ productName: '', price: '', saleRate: '', description: '', productInfo: '', categoryId: '', images: [], isButtonContact: false });
        setErrors({ productName: '', price: '', saleRate: '', description: '', productInfo: '', categoryId: '', images: '', isButtonContact: '' });
        setProductTypes([""]);
    };

    // Thêm một loại sản phẩm mới vào biểu mẫu.
    const handleAddProductType = () => {
        setProductTypes([...productTypes, ""]);
    };
    
    // Cập nhật dữ liệu của loại sản phẩm đang được chỉnh sửa.
    const handleProductTypeChange = (index, value) => {
        const updatedProductTypes = [...productTypes];
        updatedProductTypes[index] = value;
        setProductTypes(updatedProductTypes);
    };
    
    // Loại bỏ một loại sản phẩm khỏi biểu mẫu.
    const handleRemoveProductType = (index) => {
        const updatedProductTypes = productTypes.filter((_, i) => i !== index);
        setProductTypes(updatedProductTypes);
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
                    <h2 className="text-2xl mb-4 text-center text-gray-900 dark:text-white">{titleForm}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 lg:col-span-3">
                            <Input
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                error={errors.productName}
                                placeholder="Nhập tên sản phẩm"
                                label="Tên sản phẩm"
                                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                            />
                        </div>

                        <div className="col-span-1 lg:col-span-3">
                            <CustomQuillEditorText
                                id="productInfo"
                                name="productInfo"
                                value={formData.productInfo}
                                onChange={handleChangeProductInfo}
                                error={errors.productInfo}
                                placeholder="Nhập thông tin sản phẩm"
                                label="Thông tin sản phẩm"
                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded p-2"
                            />
                        </div>

                        <div className="col-span-1 lg:col-span-3">
                            <CustomQuillEditorText
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChangeDescription}
                                error={errors.description}
                                placeholder="Nhập mô tả sản phẩm"
                                label="Mô tả sản phẩm"
                                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded p-2"
                            />
                        </div>

                        <div className="col-span-1 lg:col-span-3">
                            <CheckBox
                                id="isButtonContact"
                                name="isButtonContact"
                                checked={formData.isButtonContact}
                                onChange={handleChange}
                                error={errors.isButtonContact}
                                lableCheckBox="Chỉ cho liên hệ"
                                className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <Select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            error={errors.categoryId}
                            options={categories}
                            placeholder="Chọn danh mục"
                            label="Danh mục"
                            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                            optionLabelKey="categoryName"
                        />

                        {!formData.isButtonContact && (
                            <>
                                <Input
                                    id="price"
                                    name="price"
                                    value={formData.price || ""}
                                    onChange={handleChange}
                                    error={errors.price}
                                    placeholder="Nhập giá sản phẩm"
                                    label="Giá sản phẩm"
                                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                                />

                                <Input
                                    id="saleRate"
                                    name="saleRate"
                                    value={formData.saleRate || ""}
                                    onChange={handleChange}
                                    error={errors.saleRate}
                                    placeholder="Nhập giảm giá (%)"
                                    label="Giảm giá (%)"
                                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                                />
                            </>

                        )}

                        <div className="">
                            <label className="block text-gray-700 dark:text-white mb-2">Loại sản phẩm</label>
                            {productTypes.map((type, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between mb-2 space-x-2"
                                >
                                    <span className="hidden sm:block text-gray-700 dark:text-white whitespace-nowrap">
                                        Loại sản phẩm {index + 1}
                                    </span>
                                    <Input
                                        id={`productType-${index}`}
                                        name={`productType-${index}`}
                                        value={type}
                                        onChange={(e) => handleProductTypeChange(index, e.target.value)}
                                        placeholder="Nhập loại sản phẩm"
                                        label=""
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded p-2"
                                    />
                                    {/* Nút Xóa */}
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveProductType(index)}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="text-blue-500 hover:text-blue-700 mt-2"
                                onClick={handleAddProductType}
                            >
                                + Thêm loại sản phẩm
                            </button>
                        </div>

                        {!initialData && (
                            <ImageUpload
                                images={formData.images}
                                onChange={handleChange}
                                onRemove={handleRemoveImage}
                                error={errors.images}
                                label="Ảnh sản phẩm (Mỗi ảnh tối đa 5MB)"
                            />
                        )}
                    </div>

                    <div className="flex justify-between mt-6 gap-4">
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

export default ProductForm;
