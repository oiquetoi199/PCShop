import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import { formatLargeNumber } from "../../../utils/FormatUtils";
import { formatDateTime } from "../../../utils/DateUtils";
import { formatCurrency } from '../../../utils/FormatCurrency';
import PaginationDarkMode from '../../../common/pagination/PaginationDarkMode';

const OrderList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderIdToDelete, setOrderIdToDelete] = useState(null);
    const [responseText, setResponseText] = useState("");

    const navigate = useNavigate();

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    const fetchOrders = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/order-product/find-all?page=${page}&size=${size}`, {
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
                setOrders(data.content);
                setTotalPages(data.totalPages);
            } else {
                setOrders([]);
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

    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [orderIdToDelete, currentPage, pageSize]);

    const openModal = (title, message, error) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsError(error);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);

        if (responseText === "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            navigate("/");
        }
    };

    const handleConfirmOrder = async (id, status) => {
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('status', status);

            const response = await fetch(`${apiUrl}/order-product/update-status`, {
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
                openModal('Thông báo', 'Cập nhật trạng thái đơn hàng thành công.', false);
                fetchOrders();
            } else {
                openModal('Lỗi', 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    const handleView = (id) => {
        navigate(`/dashboard/order-detail/${id}`);
    };

    const handleDelete = (id) => {
        setOrderIdToDelete(id);
        setIsOpenConfirm(true);
    };

    const confirmDelete = async () => {
        setIsOpenConfirm(false);
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${apiUrl}/order-product/delete/${orderIdToDelete}`, {
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
                openModal('Thông báo', 'Xóa đơn hàng thành công.', false);
            } else {
                openModal('Lỗi', 'Không thể xóa đơn hàng. Vui lòng thử lại.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi xóa đơn hàng. Vui lòng thử lại.', true);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
            setOrderIdToDelete(null);
        }
    };

    const getOrderStatus = (status) => {
        switch (status) {
            case 0: return 'Chờ xác nhận';
            case 1: return 'Đang chuẩn bị hàng';
            case 2: return 'Chờ vận chuyển';
            case 3: return 'Đang vận chuyển';
            case 4: return 'Giao hàng thành công';
            default: return 'Không xác định';
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="flex flex-col items-center bg-white dark:bg-gray-800 min-h-screen">
                <div className="w-full max-w-full mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Danh sách đơn hàng</h2>
                    <div className="w-full">
                        {orders.map((order) => (
                            <div key={order.orderProduct.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{order.orderProduct.orderCode}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(order.orderProduct.createDateTime)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{getOrderStatus(order.orderProduct.status)}</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <div className="md:w-1/3">
                                        <p className="font-bold text-gray-900 dark:text-white">Khách Hàng:</p>
                                        <p className="text-gray-900 dark:text-white">{order.orderProduct.fullName}</p>
                                        <p className="text-gray-900 dark:text-white">{order.orderProduct.phone}</p>
                                        <p className="text-gray-900 dark:text-white">{order.orderProduct.address}</p>
                                    </div>

                                    <div className="md:w-2/3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {order.orderProductItemList.map((item) => {
                                                return (
                                                    <div key={item.id} className="flex items-center space-x-4 mt-2 ml-2">
                                                        <Link to={`/product-detail/${item.id}`}>
                                                            <img
                                                                src={`data:image/jpeg;base64,${item.image}`}
                                                                alt={item.productName}
                                                                className="w-[128px] h-[128px] min-w-[128px] min-h-[128px] object-cover rounded-lg"
                                                            />
                                                        </Link>
                                                        <div>
                                                            <p className="font-medium text-gray-700 dark:text-gray-300">{item.productName} {item.productType ? ' - ' + item.productType : ''}</p>
                                                            <p className="text-gray-500 dark:text-gray-400">Số lượng: {item.quantity}</p>
                                                            {item.saleRate > 0 ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="text-gray-700 dark:text-gray-300">{formatLargeNumber(item.newPrice)}</p>
                                                                    <p className="text-gray-500 dark:text-gray-400 line-through">{formatLargeNumber(item.price)}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-700 dark:text-gray-300">{formatLargeNumber(item.price)}</p>
                                                            )}

                                                            <p className="text-gray-500 dark:text-gray-400">Tổng giá: {formatLargeNumber(item.totalPrice)}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Số lượng: {order.orderProduct.cartTotalQuantity}</p>
                                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Phí vận chuyển: {formatCurrency(order.orderProduct.deliveryPrice)}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-gray-700 dark:text-gray-300">Thành tiền: {formatCurrency(order.orderProduct.cartTotalPrice)}</p>
                                    <p className="text-xl font-bold text-red-700 dark:text-red-500">Thanh toán: {formatCurrency(order.orderProduct.paymentAmount)}</p>
                                </div>
                                <div className="mt-4 flex justify-end space-x-4">
                                    <button
                                        className={`flex items-center ${order.orderProduct.status === 4 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'}`}
                                        onClick={() => order.orderProduct.status !== 4 && handleConfirmOrder(order.orderProduct.id, order.orderProduct.status)}
                                        disabled={order.orderProduct.status === 4}
                                    >
                                        <FaEdit />
                                        {order.orderProduct.status === 0
                                            ? 'Xác nhận đơn hàng'
                                            : order.orderProduct.status === 1
                                                ? 'Đã đóng hàng'
                                                : order.orderProduct.status === 2
                                                    ? 'Đã lấy hàng'
                                                    : order.orderProduct.status === 3
                                                        ? 'Đã giao hàng'
                                                        : 'Hoàn thành'
                                        }
                                    </button>
                                    <button
                                        className="flex items-center text-blue-500 hover:underline"
                                        onClick={() => handleView(order.orderProduct.id)}
                                    >
                                        <FaEye /> Chi tiết
                                    </button>
                                    <button
                                        className={`flex items-center text-red-500 hover:underline ${order.orderProduct.status === 4 ? 'cursor-not-allowed text-gray-400' : ''}`}
                                        onClick={() => order.orderProduct.status !== 4 && handleDelete(order.orderProduct.id)}
                                        disabled={order.orderProduct.status === 4}
                                    >
                                        <FaTrashAlt /> {order.orderProduct.status !== 4 ? 'Hủy đơn' : 'Xóa đơn hàng'}
                                    </button>
                                </div>
                            </div>
                        ))}
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
                    message="Bạn có chắc chắn muốn xóa đơn hàng này không?"
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

export default OrderList;