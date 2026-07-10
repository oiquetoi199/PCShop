import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import TextWithExpand from '../../../common/text-expand/TextWithExpand';
import PaginationDarkMode from '../../../common/pagination/PaginationDarkMode';

const ContactList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [contacts, setContacts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [contactIdToDelete, setContactIdToDelete] = useState(null);

    const [responseText, setResponseText] = useState("");

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    const pageSize = 5;

    useEffect(() => {
        fetchContacts(currentPage, pageSize);
    }, [contactIdToDelete, currentPage, pageSize]); 

    const fetchContacts = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/contact/find-all?page=${page}&size=${size}`, {
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
                setContacts(data.content);
                setTotalPages(data.totalPages);
            } else {
                setContacts([]);
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

    const handleEdit = async (id) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const formData = new FormData();
            formData.append('id', id);

            const response = await fetch(`${apiUrl}/contact/update-status`, {
                method: 'PUT',
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
                openModal('Thông báo', 'Cập nhật trạng thái liên hệ thành công.', false);
                fetchContacts();
            } else {
                openModal('Lỗi', 'Không thể cập nhật trạng thái liên hệ. Vui lòng thử lại.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật trạng thái liên hệ. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id) => {
        setContactIdToDelete(id);
        setIsOpenConfirm(true);
    };

    const confirmDelete = async () => {
        setIsOpenConfirm(false);
        setLoading(true);
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${apiUrl}/contact/delete/${contactIdToDelete}`, {
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
    
            if (responseData && responseData.message === "success") {
                openModal('Thông báo', 'Xóa thành công.', false);
            } else {
                openModal('Lỗi', 'Không thể xóa thông tin. Vui lòng thử lại.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi xóa thông tin. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
            setContactIdToDelete(null);
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
                    <h2 className="text-2xl text-center mb-4 text-gray-900 dark:text-white">Thông tin liên hệ khách hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                        <table className="min-w-full border bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900">
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Tên khách hàng</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Số điện thoại</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Địa chỉ</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Lời nhắn</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Mặt hàng quan tâm</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Tình trạng</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày gửi</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày liên hệ lại</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Xác nhận</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact => (
                                    <tr key={contact.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.fullName}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.phone}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.address}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white"><TextWithExpand text={contact.note} /></td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{contact.productName}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.status === 'N' ? 'Chưa lên hệ' : 'Đã liên hệ'}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.createDate}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{contact.updateDate}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                className={`flex items-center text-blue-500 hover:underline whitespace-nowrap ${contact.status === 'Y' ? 'cursor-not-allowed opacity-50' : ''}`}
                                                onClick={() => contact.status === 'N' && handleEdit(contact.id)}
                                                disabled={contact.status === 'Y'}
                                            >
                                                <FaEdit /> {contact.status === 'N' ? 'Xác nhận liên hệ' : 'Đã liên hệ'}
                                            </button>
                                        </td>

                                        <td className="py-2 px-4 border-b">
                                            <button
                                                className={`flex items-center text-red-500 hover:underline ${contact.status === 'N' ? 'cursor-not-allowed opacity-50' : ''}`}
                                                onClick={() => contact.status === 'Y' && handleDelete(contact.id)}
                                            >
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
                    message="Bạn có chắc chắn muốn xóa liên hệ này không?"
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

export default ContactList;

