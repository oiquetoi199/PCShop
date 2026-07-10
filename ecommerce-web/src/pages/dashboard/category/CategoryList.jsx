import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import PaginationDarkMode from '../../../common/pagination/PaginationDarkMode';

const CategoryList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    const [responseText, setResponseText] = useState("");

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    const pageSize = 5;

    useEffect(() => {
        fetchCategories(currentPage, pageSize);
    }, [categoryIdToDelete, currentPage, pageSize]);  
    
    const fetchCategories = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/category/find-all?page=${page}&size=${size}`, {
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

            if (data && Array.isArray(data.content)) {
                setCategories(data.content);
                setTotalPages(data.totalPages);
            } else {
                setCategories([]);
            }

            setCurrentPage(page);
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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

    const handleEdit = (id) => {
        navigate(`/dashboard/update-category/${id}`);
    };

    const handleDelete = (id) => {
        setCategoryIdToDelete(id);
        setIsOpenConfirm(true);
    };

    const confirmDelete = async () => {
        setIsOpenConfirm(false);
        setLoading(true);
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${apiUrl}/category/delete/${categoryIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
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
    
            const responseData = await response.json();

            if (responseData) {
                if (responseData.message === "success") {
                    openModal('Thông báo', 'Xóa thành công.', false);
                } else if (responseData.message === "delete_err") {
                    openModal('Thông báo', 'Không thể xóa, có thể danh mục này đang có danh mục con và sản phẩm.', true);
                } else {
                    openModal('Lỗi', 'Không thể xóa danh mục. Vui lòng thử lại.', true);
                }
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi xóa danh mục. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
            setCategoryIdToDelete(null);
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
                    <h2 className="text-2xl text-center mb-4 text-gray-900 dark:text-white">Danh sách danh mục</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                        <table className="border bg-white dark:bg-gray-800 w-full">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900">
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Tên Danh Mục</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Danh mục cha</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Màu nền</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Vị trí</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Người tạo</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Người chỉnh sửa</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày tạo</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày chỉnh sửa</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Sửa</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <td className="py-2 px-4 border-b text-black dark:text-white">{category.categoryName}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white">{category.parentName ? category.parentName : ''}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white"> 
                                        <div style={{ backgroundColor: category.color }} className="w-6 h-6 rounded-full"></div>
                                    </td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white">{category.position}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white">{category.initBy}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white">{category.updateBy}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{category.createDate}</td>
                                    <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{category.updateDate}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="flex items-center text-blue-500 hover:underline" onClick={() => handleEdit(category.id)}>
                                        <FaEdit/> Sửa
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="flex items-center text-red-500 hover:underline" onClick={() => handleDelete(category.id)}>
                                        <FaTrashAlt/> Xóa
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <PaginationDarkMode
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>

                <ConfirmModal
                    isOpen={isOpenConfirm}
                    onClose={() => setIsOpenConfirm(false)}
                    onConfirm={confirmDelete}
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa danh mục này không?"
                />

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

export default CategoryList;

