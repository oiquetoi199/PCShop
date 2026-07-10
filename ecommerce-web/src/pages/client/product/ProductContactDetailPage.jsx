import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import Modal from '../../../common/alert/Modal';
import ProductContact from '../../../section/client/ProductContact';

const ProductContactDetailPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

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
    };

    const handleContactNow = (product) => {
        navigate('/contact-now', {
            state: {
                product: product
            },
        });
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
                {product && (
                    <div className="w-full max-w-7xl">
                        <ProductContact
                            product={product}
                            onContactNow={handleContactNow}
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
            </div>
        </LoadingLayout>
    );
};

export default ProductContactDetailPage;