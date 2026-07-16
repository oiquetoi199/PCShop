import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../common/input/ImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';

// Hiển thị giao diện quản lý hình ảnh của sản phẩm.
const UpdateProductImage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [titleStatus, setTitleStatus] = useState("Hình ảnh hiện có");
    const [loadNewData, setLoadNewData] = useState(0);

    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

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

    useEffect(() => {
        // Gọi API để tải hình ảnh của sản phẩm.
        const fetchProductImages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/product-image/find-product-id/${id}`, {
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
    
                if (data && data.length > 0) {
                    const imagesWithIdAndData = data.map(({ id, imageData }) => {
                        if (typeof imageData === "string" && imageData.startsWith("data:image")) {
                            return { id, imageData };
                        } else if (typeof imageData === "string") {
                            return { id, imageData };
                        } else {
                            return { id, imageData: "" };
                        }
                    });
                    
                    setExistingImages(imagesWithIdAndData);                    
                } else {
                    setTitleStatus("Không có hình ảnh");
                }
            } catch (error) {
                openModal("Lỗi", "Không thể tải hình ảnh sản phẩm.", true);
                setTitleStatus("Không có hình ảnh");
            } finally {
                setLoading(false);
            }
        };

        fetchProductImages();
    }, [loadNewData]);

    // Tiếp nhận danh sách hình ảnh mới và cập nhật phần xem trước.
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const imageFiles = files.filter(file => file.type.startsWith("image/"));

        const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB
        if (oversizedFiles.length > 0) {
            setError("Chỉ được chọn các tệp ảnh có kích thước tối đa 5MB.");
        } else if (imageFiles.length !== files.length) {
            setError("Chỉ được chọn các tệp ảnh (jpg, png, gif, ...)");
        } else {
            setImages((prevImages) => [...prevImages, ...imageFiles]);
            setError("");
        }
    };

    // Loại bỏ hình ảnh mới khỏi danh sách tải lên.
    const handleImageRemove = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Đánh dấu hoặc loại bỏ hình ảnh đã lưu khỏi sản phẩm.
    const handleExistingImageRemove = (id) => {
        setExistingImages((prevImages) => prevImages.filter((image) => image.id !== id));
    };

    // Kiểm tra dữ liệu người dùng nhập trước khi tiếp tục xử lý.
    const validate = () => {
        if (existingImages.length == 0 && images.length == 0) {
            setError("Vui lòng tải ảnh lên.");
            return false;
        }

        if ((existingImages.length + images.length) > 10) {
            setError("Không được tải lên quá 10 tệp ảnh.");
        }

        return true;
    }

    // Lưu dữ liệu hiện tại và phản hồi kết quả cho người dùng.
    const handleSave = async () => {
        if (validate()) {
            setLoading(true);
            
            const formData = new FormData();
            formData.append("productId", id);
            const existingImageIds = existingImages.map(image => image.id);
            formData.append("existingImages", JSON.stringify(existingImageIds));

            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });

            const token = localStorage.getItem('token');
            
            try {
                const response = await fetch(`${apiUrl}/product-image/update`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                    body: formData,
                });

                if (response.status === 401) {
                    const message = await response.text();
                    setResponseText(message);
                    openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
                    setLoading(false);
                    return;
                }

                const responseData = await response.json();

                if (responseData && responseData.message === "saved") {
                    openModal('Thành công', 'Dữ liệu đã được lưu thành công!', false);
                    setImages([]);
                } else {
                    openModal('Lỗi', 'Không thể cập nhật hình ảnh. Vui lòng thử lại.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật hình ảnh. Vui lòng thử lại sau.', true);
            } finally {
                setLoading(false);
                setLoadNewData(loadNewData + 1);
            }
        }
    };


    return (
        <LoadingLayout loading={loading}>
            <div className="justify-center items-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900">
                <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">Chỉnh sửa ảnh</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{titleStatus}</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                        {existingImages && existingImages.map(({ id, imageData }, index) => (
                        <div key={id} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                            <img src={`data:image/jpeg;base64,${imageData}`} alt={`Hình hiện có ${index}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleExistingImageRemove(id)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    </div>
                </div>

                <ImageUpload
                    images={images}
                    onChange={handleImageChange}
                    onRemove={handleImageRemove}
                    error={error}
                    label="Tải lên hình ảnh mới (Mỗi ảnh tối đa 5MB)"
                />

                <div className="mt-6">
                    <button
                        onClick={handleSave}
                        className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
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

export default UpdateProductImage;
