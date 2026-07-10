import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import ProductDetail from '../../../section/client/ProductDetail';
import Modal from '../../../common/alert/Modal';
import LoginPopup from '../../../components/LoginPopup/LoginPopup';

const ProductDetailPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const { handleLoginSuccess, handleLoginPopup } = useOutletContext();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loginPopup, setLoginPopup] = useState(false);
    const navigate = useNavigate();
    const [responseText, setResponseText] = useState("");
    const { username, setUsername } = useOutletContext();
    

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${apiUrl}/product/guest/product-detail/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const openModal = (title, message, error) => {
        setModalTitle(title);
        setModalMessage(message);
        setIsError(error);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);

        if (!isError) {
            navigate("/cart-product");
          }
      
          if (responseText == "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            setUsername(null);
            navigate("/");
          }
    };

    const handleAddToCart = async (product, quantity, selectedProductType, totalPrice) => {
        if (product.productTypes.length > 0 && !selectedProductType) {
            openModal('Thông báo', 'Vui lòng chọn loại sản phẩm.', true);
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            handleLoginPopup();
        } else {
            setLoading(true);
    
            const dataToSubmit = {
                image: product.image,
                productName: product.productName,
                price: product.price,
                newPrice: product.newPrice,
                saleRate: product.saleRate,
                totalPrice: totalPrice,
                quantity: quantity,
                productType: selectedProductType,
                productId: product.id,
            };

            try {
                const response = await fetch(`${apiUrl}/cart-product/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataToSubmit),
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
                    openModal('Thông báo', 'Thêm sản phẩm vào giỏ hàng thành công.', false);
                } else {
                    openModal('Thông báo', 'Thêm sản phẩm vào giỏ hàng không thành công.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.', true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBuyNow = (product, quantity, selectedProductType, totalPrice) => {
        if (product.productTypes.length > 0 && !selectedProductType) {
            openModal('Thông báo', 'Vui lòng chọn loại sản phẩm.', true);
            return;
        }
        
        const token = localStorage.getItem('token');
        
        if (!token) {
            handleLoginPopup();
        } else {
            
            const cartProducts = [
                {
                    id: 1,
                    image: product.image,
                    productName: product.productName,
                    price: product.price,
                    newPrice: product.newPrice,
                    saleRate: product.saleRate,
                    productId: product.id,
                    quantity: quantity,
                    productType: selectedProductType,
                    totalPrice: totalPrice,
                },
            ];

            navigate('/order-product', {
                state: {
                    cartProducts: cartProducts,
                    cartTotalQuantity: quantity,
                    cartTotalPrice: totalPrice,
                    action: 1
                },
            });
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
                {product && (
                    <div className="w-full max-w-7xl">
                        <ProductDetail
                            product={product}
                            onAddToCart={handleAddToCart}
                            onBuyNow={handleBuyNow}
                        />
                    </div>
                )}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalTitle}
                    message={modalMessage}
                    isError={isError}
                />

                {loginPopup && (
                    <LoginPopup
                        loginPopup={loginPopup}
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}
            </div>
        </LoadingLayout>
    );
};

export default ProductDetailPage;