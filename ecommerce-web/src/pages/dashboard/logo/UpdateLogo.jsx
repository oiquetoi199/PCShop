import React, { useState, useEffect } from 'react';
import ImageUpload from '../../../common/input/ImageUpload';
import { useNavigate } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';
import Button from '../../../common/button/Button';
import RadioButton from '../../../common/input/RadioButton';

// Hiển thị giao diện quản lý và lựa chọn logo chính.
const UpdateLogo = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
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
    const [selectedImageId, setSelectedImageId] = useState(null);


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
        // Gọi API để tải danh sách logo hiện có.
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/logo/list`, {
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
                    const imagesWithIdAndData = data.map(({ id, imageData, isLogo }) => {
                        if (isLogo) {
                            setSelectedImageId(id);
                        }
                        if (typeof imageData === "string" && imageData.startsWith("data:image")) {
                            return { id, imageData, isLogo };
                        } else if (typeof imageData === "string") {
                            return { id, imageData, isLogo };
                        } else {
                            return { id, imageData: "", isLogo };
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

        fetchImages();
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
    // Ghi nhận hình ảnh được người dùng lựa chọn.
    const handleImageSelect = (id) => {
        setSelectedImageId(id);
    };

    // Lưu dữ liệu hiện tại và phản hồi kết quả cho người dùng.
    const handleSave = async () => {
        if (validate()) {
            setLoading(true);

            const formData = new FormData();
            formData.append("productId", "");

            const existingImageIds = existingImages.map(image => image.id);
            formData.append("existingImages", JSON.stringify(existingImageIds));


            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });

            existingImages.forEach((image, index) => {
                const isLogo = selectedImageId === image.id;
                formData.append(`isLogo[${index}]`, isLogo);
            });


            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${apiUrl}/logo/update`, {
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
            <div className="justify-center items-center min-h-screen px-4 bg-gray-100 dark:bg-gray-900 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">Chỉnh sửa Logo</h2>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white">{titleStatus}</h3>
                    <div className="flex items-center gap-4 flex-wrap">
                        {existingImages && existingImages.map(({ id, imageData, isLogo }, index) => (
                            <div key={id} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                <img src={`data:image/jpeg;base64,${imageData}`} alt={`Hình hiện có ${index}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => handleExistingImageRemove(id)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                                >
                                    &times;
                                </button>

                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                                    <RadioButton
                                        type="radio"
                                        name="selectedImage"
                                        value={id}
                                        checked={selectedImageId === id}
                                        onChange={() => handleImageSelect(id)}
                                        id={`radio-${id}`}
                                        className="hidden"
                                        label=""
                                    />
                                    <label
                                        htmlFor={`radio-${id}`}
                                        className={`cursor-pointer text-white bg-black bg-opacity-50 px-2 py-1 rounded-md text-xs ${selectedImageId === id ? 'bg-blue-500' : 'bg-black'}`}
                                    >
                                        Chọn
                                    </label>
                                </div>
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

                <div className="mt-6 w-1/4">
                    <Button
                        onClick={handleSave}
                        className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
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
        </LoadingLayout>
    );

};

export default UpdateLogo;
