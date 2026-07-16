import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../../common/button/Button';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { formatLargeNumber } from '../../../utils/FormatUtils';

// Hiển thị giỏ hàng, số lượng sản phẩm và tổng giá trị đơn.
const CartProductPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [cartProducts, setCartProducts] = useState([]);
    const [cartTotalPrice, setCartTotalPrice] = useState(0);
    const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [responseText, setResponseText] = useState('');
    const { username, setUsername } = useOutletContext();
    const navigate = useNavigate();

    // Gọi API để tải giỏ hàng của người dùng và cập nhật tổng số lượng, tổng tiền.
    const fetchCartData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/cart-product/cart-list`, {
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
            setCartProducts(data.cartProducts);
            setCartTotalPrice(data.cartTotalPrice);
            setCartTotalQuantity(data.cartTotalQuantity);
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [itemIdToDelete]);

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

    // Ghi nhận dữ liệu cần xóa và mở hộp thoại xác nhận.
    const handleDelete = (id) => {
        setItemIdToDelete(id);
        setIsOpenConfirm(true);
    };

    // Gửi yêu cầu xóa dữ liệu đã xác nhận và cập nhật lại danh sách hiển thị.
    const confirmDelete = async () => {
        try {
            setIsOpenConfirm(false);
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${apiUrl}/cart-product/delete/${itemIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
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
                openModal('Thông báo', 'Xóa sản phẩm thành công.', false);
                setItemIdToDelete(null);
            } else {
                openModal('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi kết nối đến server. Vui lòng thử lại sau.', true);
        } finally {
            setLoading(false);
        }
    };

    // Cập nhật số lượng sản phẩm và tính lại dữ liệu giỏ hàng.
    const handleQuantityChange = async (id, delta) => {
        try {
            setLoading(false);
            const token = localStorage.getItem('token');
            const updatedProduct = cartProducts.find((item) => item.id === id);
            if (!updatedProduct) return;

            const newQuantity = Math.max(updatedProduct.quantity + delta, 1);

            const formData = new FormData();
            formData.append('id', id);
            formData.append('quantity', newQuantity);

            const response = await fetch(`${apiUrl}/cart-product/update`, {
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

            const data = await response.json();

            if (data.message === "saved") {
                fetchCartData();
            } else {
                openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật sản phẩm.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Không thể kết nối đến server. Vui lòng thử lại sau.', true);
        } finally {
            setLoading(false);
        }
    };

    // Khởi tạo thao tác mua sản phẩm từ trang chi tiết.
    const handleBuyProduct = () => {
        navigate('/order-product', {
            state: {
                cartProducts: cartProducts,
                cartTotalQuantity: cartTotalQuantity,
                cartTotalPrice: cartTotalPrice,
                action: 0
            },
        });
    }

    return (
        <LoadingLayout loading={loading}>
            <div className="flex flex-col md:flex-row p-4 md:p-8">
                <div className="w-full md:w-3/4">
                    <h2 className="text-xl font-semibold mb-4">Giỏ hàng của bạn</h2>
                    {cartProducts.length === 0 ? (
                        <p>Giỏ hàng của bạn đang trống.</p>
                    ) : (
                        cartProducts.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-4 border-b">
                                <img src={`data:image/jpeg;base64,${item.image}`} alt={item.productName} className="w-16 h-16 md:w-20 md:h-20" />
                                <div className="flex-1">
                                    <p>{item.productName} - {item.productType}</p>
                                    {item.newPrice > 0 ? (
                                        <div className="flex items-center space-x-2">
                                            <p className="text-red-500 font-semibold">{formatLargeNumber(item.newPrice)}</p>
                                            <p className="line-through text-gray-500">{formatLargeNumber(item.price)}</p>
                                        </div>
                                    ) : (
                                        <p>{formatLargeNumber(item.price)} VNĐ</p>
                                    )}
                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 mt-2">Xóa</button>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                        className="px-2 bg-gray-200 rounded"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        className="w-10 text-center border"
                                        readOnly
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                        className="px-2 bg-gray-200 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                                <p>{formatLargeNumber(item.totalPrice)}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-md mt-4 md:mt-0 md:ml-8">
                    <h3 className="text-lg font-semibold mb-2">Tóm Tắt Đơn Hàng</h3>
                    <div className="flex justify-between mt-4">
                        <span>Tổng tiền:</span>
                        <span className="font-bold">{formatLargeNumber(cartTotalPrice)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Bạn có thể nhập mã giảm giá ở trang thanh toán</p>
                    <Button onClick={handleBuyProduct}>Tiến hành đặt hàng</Button>
                    <button
                        onClick={() => navigate('/')}
                        className="border border-black text-black rounded py-2 w-full mt-2"
                    >
                        Mua thêm sản phẩm
                    </button>
                </div>

                <ConfirmModal
                    isOpen={isOpenConfirm}
                    onClose={() => setIsOpenConfirm(false)}
                    onConfirm={confirmDelete}
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
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

export default CartProductPage;