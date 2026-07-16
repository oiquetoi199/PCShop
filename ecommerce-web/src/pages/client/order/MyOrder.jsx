import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaEye, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import { formatLargeNumber } from "../../../utils/FormatUtils";
import { formatDateTime } from "../../../utils/DateUtils";
import { formatCurrency } from '../../../utils/FormatCurrency';
import PaginationNormal from '../../../common/pagination/PaginationNormal';

// Hiển thị danh sách đơn hàng của người dùng hiện tại.
const MyOrder = () => {
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
    const { username, setUsername } = useOutletContext();

    const navigate = useNavigate();

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [orderIdToDelete, currentPage, pageSize]);

    // Gọi API để tải danh sách đơn hàng theo trang hiện tại.
    const fetchOrders = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/order-product/my-orders?page=${page}&size=${size}`, {
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

    // Cập nhật trang hiện tại và tải dữ liệu của trang được chọn.
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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

        if (responseText === "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            setUsername(null);
            navigate("/");
        }
    };

    // Điều hướng hoặc chuyển giao diện sang chế độ chỉnh sửa dữ liệu.
    const handleEdit = (id) => {
        navigate(`/my-order-detail/${id}`);
    };

    // Mở trang hoặc khu vực xem chi tiết dữ liệu được chọn.
    const handleView = (id) => {
        navigate(`/my-order-detail/${id}`);
    };

    // Ghi nhận dữ liệu cần xóa và mở hộp thoại xác nhận.
    const handleDelete = (id) => {
        setOrderIdToDelete(id);
        setIsOpenConfirm(true);
    };

    // Gửi yêu cầu xóa dữ liệu đã xác nhận và cập nhật lại danh sách hiển thị.
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

    // Chuyển mã trạng thái đơn hàng thành nội dung dễ đọc để hiển thị.
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
            <div className="container flex flex-col items-center bg-white min-h-screen">
                <div className="w-full max-w-full mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">Đơn Hàng Của Tôi</h2>
                    <div className="w-full">
                        {orders.map((order) => (
                            <div key={order.orderProduct.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">{order.orderProduct.orderCode}</h3>
                                    <p className="text-sm text-gray-500">{formatDateTime(order.orderProduct.createDateTime)}</p>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-gray-500">{getOrderStatus(order.orderProduct.status)}</p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center">
                                    <div className="md:w-1/3">
                                        <p className="font-bold">Khách Hàng:</p>
                                        <p>{order.orderProduct.fullName}</p>
                                        <p>{order.orderProduct.phone}</p>
                                        <p>{order.orderProduct.address}</p>
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
                                                            <p className="font-medium text-gray-700">{item.productName} {item.productType ? ' - ' + item.productType : ''}</p>
                                                            <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                                            {item.saleRate > 0 ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <p className="text-gray-700">{formatLargeNumber(item.newPrice)}</p>
                                                                    <p className="text-gray-500 line-through">{formatLargeNumber(item.price)}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-700">{formatLargeNumber(item.price)}</p>
                                                            )}

                                                            <p className="text-gray-500">Tổng giá: {formatLargeNumber(item.totalPrice)}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-gray-700">Số lượng: {order.orderProduct.cartTotalQuantity}</p>
                                    <p className="text-xl font-bold text-gray-700">Phí vận chuyển: {formatCurrency(order.orderProduct.deliveryPrice)}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xl font-bold text-gray-700">Thành tiền: {formatCurrency(order.orderProduct.cartTotalPrice)}</p>
                                    <p className="text-xl font-bold text-red-700">Thanh toán: {formatCurrency(order.orderProduct.paymentAmount)}</p>
                                </div>
                                <div className="mt-4 flex justify-end space-x-4">
                                    {/* <button
                                        className="flex items-center text-blue-500 hover:underline"
                                        onClick={() => handleEdit(order.orderProduct.id)}
                                    >
                                        <FaEdit /> Sửa
                                    </button> */}
                                    <button
                                        className="flex items-center text-blue-500 hover:underline"
                                        onClick={() => handleView(order.orderProduct.id)}
                                    >
                                        <FaEye /> Chi tiết
                                    </button>
                                    <button
                                        className={`flex items-center text-red-500 hover:underline ${order.orderProduct.status !== 0 ? 'cursor-not-allowed text-gray-400' : ''}`}
                                        onClick={() => order.orderProduct.status === 0 && handleDelete(order.orderProduct.id)}
                                        disabled={order.orderProduct.status !== 0}
                                    >
                                        <FaTrashAlt /> Hủy đơn
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <PaginationNormal
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

export default MyOrder;