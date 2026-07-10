import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import { formatDateTime, formatDate } from "../../../utils/DateUtils";
import PaginationDarkMode from '../../../common/pagination/PaginationDarkMode';

const UserList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [userIdToDelete, currentPage, pageSize]);

    const fetchOrders = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/user/list?page=${page}&size=${size}`, {
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
                setUsers(data.content);
                setTotalPages(data.totalPages);
            } else {
                setUsers([]);
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

    const handleView = (id) => {
        navigate(`/dashboard/user-detail/${id}`);
    };

    const handleDelete = (id) => {
        setUserIdToDelete(id);
        setIsOpenConfirm(true);
    };

    const confirmDelete = async () => {
        setIsOpenConfirm(false);
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${apiUrl}/user/delete-user/${userIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const responseData = await response.json();
        
            if (responseData && responseData.message === "success") {
                openModal('Thông báo', 'Xóa người dùng thành công.', false);
            } else {
                openModal('Lỗi', 'Không thể xóa người dùng. Vui lòng thử lại.', true);
            }
        } catch(error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setUserIdToDelete(null);
            setLoading(false);
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
                    <h2 className="text-2xl text-center mb-4 text-gray-900 dark:text-white">Danh sách tài khoản</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                        <table className="border min-w-full buser bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900">
                                    {["Tên đăng nhập", "Họ Tên", "Số Điện Thoại", "Quyền", "Ngày tạo", "Ngày cập nhật"].map(header => (
                                        <th key={header} className="py-2 px-4 buser-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">{header}</th>
                                    ))}
                                    <th className="py-2 px-4 buser-b whitespace-nowrap">Chi tiết</th>
                                    <th className="py-2 px-4 buser-b whitespace-nowrap">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{user.username}</td>
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{user.fullName}</td>
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{user.phone}</td>
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{user.role}</td>
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{formatDate(user.createDate)}</td>
                                        <td className="py-2 px-4 buser-b text-black dark:text-white">{user.updateDate ? formatDate(user.updateDate) : ""}</td>
                                        <td className="py-2 px-4 buser-b whitespace-nowrap">
                                            <button
                                                className="flex items-center text-blue-500 hover:underline"
                                                onClick={() => handleView(user.id)}
                                            >
                                                <FaEye /> Chi tiết
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 buser-b whitespace-nowrap">
                                            <button
                                                className="flex items-center text-red-500 hover:underline"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <FaTrashAlt /> Xóa
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
                    message="Bạn có chắc chắn muốn xóa tài khoản này không?"
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

export default UserList;