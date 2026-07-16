import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import LoadingLayout from "../../../common/loading/LoadingLayout";
import Modal from "../../../common/alert/Modal";
import { useNavigate } from "react-router-dom";
import Button from "../../../common/button/Button";

// Hiển thị danh sách danh mục có thể kéo thả để cập nhật thứ tự.
const SortCategory = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để tải danh mục cha phục vụ kéo thả và sắp xếp.
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
                    return;
                }

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    openModal('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại sau.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
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
        if (responseText === "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            navigate("/");
        }
    };

    // Cập nhật thứ tự dữ liệu sau khi thao tác kéo thả kết thúc.
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) return;

        if (destination.index === source.index) return;

        const reorderedCategories = [...categories];
        const [movedCategory] = reorderedCategories.splice(source.index, 1);
        reorderedCategories.splice(destination.index, 0, movedCategory);

        const updatedCategories = reorderedCategories.map((category, index) => ({
            ...category,
            position: (index + 1).toString(),
        }));

        setCategories(updatedCategories);
    };

    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${apiUrl}/category/update-position`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, 
                },
                body: JSON.stringify(categories),
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
            openModal('Lỗi', 'Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.', true);
            return false;
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto my-8">
                <h1 className="text-3xl font-bold text-center mb-6">Sắp Xếp Danh Mục</h1>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={categories && categories.length > 0 ? categories[0].id.toString() : "defaultId"}>
                        {(provided) => (
                            <ul
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-4"
                            >
                                {categories && categories.map((category, index) => (
                                    <Draggable 
                                        key={category.id} 
                                        draggableId={category.id.toString()} 
                                        index={index}
                                    >
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-4 border rounded-md bg-white dark:bg-gray-800 shadow-md"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span>{category.categoryName}</span>
                                                    <span className="text-gray-500 text-sm">Vị trí: {category.position}</span>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="flex justify-center items-center mt-4">
                    <Button
                        onClick={handleSubmit}
                        className={`bg-blue-600 dark:bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 dark:hover:bg-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                title={modalTitle} 
                message={modalMessage} 
                isError={isError} 
            />
        </LoadingLayout>
    );
};

export default SortCategory;
