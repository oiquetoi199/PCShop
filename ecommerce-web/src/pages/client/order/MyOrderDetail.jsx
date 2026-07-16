import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';
import { formatLargeNumber } from "../../../utils/FormatUtils";
import { formatDateTime } from "../../../utils/DateUtils";
import { formatCurrency } from '../../../utils/FormatCurrency';

// Hiển thị chi tiết một đơn hàng của người dùng hiện tại.
const MyOrderDetail = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [responseText, setResponseText] = useState('');
    const { id } = useParams();

    // Mở hộp thoại và thiết lập tiêu đề, nội dung cùng trạng thái hiển thị.
    const openModal = (title, message, isError) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsError(isError);
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

    useEffect(() => {
        // Gọi API để tải chi tiết đơn hàng được chọn.
        const fetchOrderProductDetail = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/order-product/my-order-detail/${id}`, {
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

                if (!response.ok) {
                    openModal('Lỗi', 'Không thể tải chi tiết đơn hàng.', true);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setOrder(data);
            } catch (err) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.', true);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderProductDetail();
    }, [id]);

    // Chuyển mã trạng thái đơn hàng thành nội dung dễ đọc để hiển thị.
    const getOrderStatus = (status) => {
        switch (status) {
            case 0: return 'Chờ xác nhận';
            case 1: return 'Chờ đóng hàng';
            case 2: return 'Chờ vận chuyển';
            case 3: return 'Đang vận chuyển';
            case 4: return 'Giao hàng thành công';
            default: return 'Không xác định';
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
                <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                    {order && order.orderProduct && (
                        <div>
                            <div className="space-y-6">
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Mã đơn hàng:</span>
                                    <span>{order.orderProduct.orderCode}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Họ tên:</span>
                                    <span>{order.orderProduct.fullName}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Số điện thoại:</span>
                                    <span>{order.orderProduct.phone}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Địa chỉ:</span>
                                    <span>{order.orderProduct.address}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Trạng thái:</span>
                                    <span>{getOrderStatus(order.orderProduct.status)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Ngày tạo:</span>
                                    <span>{formatDateTime(order.orderProduct.createDateTime)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Ghi chú:</span>
                                    <span>{order.orderProduct.note}</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Sản phẩm trong đơn hàng</h3>
                                {order.orderProductItemList.map((item, index) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center space-x-4">
                                            <img 
                                                src={`data:image/jpeg;base64,${item.image}`} 
                                                alt={item.productName} 
                                                className="w-[64px] h-[64px] min-w-[64px] min-h-[64px] object-cover rounded-md"
                                            />
                                            <div>
                                                <div>
                                                    <span className="block text-sm font-semibold">{item.productName} {item.productType ? ' - ' + item.productType : ''}</span>
                                                </div>
                                                <div>
                                                    {item.saleRate > 0 ? (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-red-500">Giảm giá: {item.saleRate}%</span>
                                                                <span className="text-green-500 font-semibold">{formatLargeNumber(item.newPrice)}</span>
                                                                <span className="line-through text-gray-500">{formatLargeNumber(item.price)}</span>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span className="text-gray-800 font-semibold">{formatLargeNumber(item.price)}</span>
                                                            </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-800 text-right">
                                            <span>Số lượng: {item.quantity}</span>
                                            <div className="mt-2">
                                                <span className="block">Tổng giá: {formatLargeNumber(item.totalPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Tổng số lượng:</span>
                                    <span>{order.orderProduct.cartTotalQuantity}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Tổng giá trị:</span>
                                    <span>{formatCurrency(order.orderProduct.cartTotalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Phí vận chuyển:</span>
                                    <span>{formatCurrency(order.orderProduct.deliveryPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span className="font-semibold">Giảm giá:</span>
                                    <span>{order.orderProduct.discountPrice ? formatLargeNumber(order.orderProduct.discountPrice) : 'Không có'}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 font-semibold">
                                    <span>Thành tiền:</span>
                                    <span>{formatCurrency(order.orderProduct.paymentAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}
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

export default MyOrderDetail;