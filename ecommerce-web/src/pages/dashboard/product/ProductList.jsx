import React, { useEffect, useState } from 'react';
import Modal from '../../../common/alert/Modal';
import { FaEdit, FaImages, FaTrashAlt } from 'react-icons/fa';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../common/alert/ModalConfirm';
import { formatLargeNumber } from "../../../utils/FormatUtils";
import TextWithExpand from '../../../common/text-expand/TextWithExpand';
import PaginationDarkMode from '../../../common/pagination/PaginationDarkMode';

// Hiển thị danh sách sản phẩm và các thao tác quản trị.
const ProductList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [responseText, setResponseText] = useState("");

    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    const pageSize = 5;

    useEffect(() => {
        fetchProducts(currentPage, pageSize);
    }, [productIdToDelete, currentPage, pageSize]);

    // Gọi API để tải danh sách sản phẩm.
    const fetchProducts = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/product/find-all?page=${page}&size=${size}`, {
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
                setProducts(data.content);
                setTotalPages(data.totalPages);
            } else {
                setProducts([]);
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

        if (responseText == "expired") {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("roles");
            navigate("/");
        }
    };

    // Điều hướng hoặc chuyển giao diện sang chế độ chỉnh sửa dữ liệu.
    const handleEdit = (id) => {
        navigate(`/dashboard/update-product/${id}`);
    };

    // Mở giao diện quản lý hình ảnh của sản phẩm được chọn.
    const handleViewImages = (id) => {
        navigate(`/dashboard/view-product-images/${id}`);
    };

    // Ghi nhận dữ liệu cần xóa và mở hộp thoại xác nhận.
    const handleDelete = (id) => {
        setProductIdToDelete(id);
        setIsOpenConfirm(true);
    };

    // Gửi yêu cầu xóa dữ liệu đã xác nhận và cập nhật lại danh sách hiển thị.
    const confirmDelete = async () => {
        try {
            setIsOpenConfirm(false);
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/product/delete/${productIdToDelete}`, {
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

            setLoading(false);

            const responseData = await response.json();

            if (responseData && responseData.message === "success") {
                openModal('Thông báo', 'Xóa thành công.', false);
                setProductIdToDelete(null);
            } else {
                openModal('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.', true);
            }
        } catch (error) {
            setLoading(false);
            openModal('Lỗi', 'Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.', true);
        }
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="container mx-auto p-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full">
                    <h2 className="text-2xl text-center mb-4 text-gray-900 dark:text-white">Danh Sách Sản Phẩm</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto">
                    <table className="min-w-full border bg-white dark:bg-gray-800">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900">
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Tên Sản Phẩm</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Thông Tin</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Mô Tả</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Loại sản phẩm</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Giá gốc</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Giảm Giá (%)</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Giá bán</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Người tạo</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Người chỉnh sửa</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày tạo</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Ngày chỉnh sửa</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Danh Mục</th>
                                    <th className="py-2 px-4 border-b text-left text-gray-900 dark:text-gray-100 whitespace-nowrap">Phương thức</th>
                                    <th className="py-2 px-4 border-b whitespace-nowrap">Sửa</th>
                                    <th className="py-2 px-4 border-b whitespace-nowrap">Xem ảnh</th>
                                    <th className="py-2 px-4 border-b whitespace-nowrap">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-200 dark:hover:bg-gray-700">
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.productName}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">
                                            <TextWithExpand text={product.productInfo} maxLength={20} />
                                        </td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">
                                            <TextWithExpand text={product.description} maxLength={20} />
                                        </td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">
                                            <TextWithExpand text={product.productType} maxLength={20} />
                                        </td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{formatLargeNumber(product.price)}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.saleRate}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.saleRate > 0 ? formatLargeNumber(product.newPrice) : formatLargeNumber(product.price)}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.initBy}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.updateBy}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{product.createDate}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white whitespace-nowrap">{product.updateDate}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.categoryName}</td>
                                        <td className="py-2 px-4 border-b text-black dark:text-white">{product.isButtonContact == 'Y' ? 'Liên hệ' : 'Mua hàng'}</td>
                                        <td className="py-2 px-4 border-b whitespace-nowrap">
                                            <button
                                                className="flex items-center text-blue-500 hover:underline"
                                                onClick={() => handleEdit(product.id)}
                                            >
                                                <FaEdit /> Sửa
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border-b whitespace-nowrap">
                                            <button
                                                className="flex items-center text-green-500 hover:underline"
                                                onClick={() => handleViewImages(product.id)}
                                            >
                                                <FaImages /> Xem Ảnh
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border-b whitespace-nowrap">
                                            <button
                                                className="flex items-center text-red-500 hover:underline"
                                                onClick={() => handleDelete(product.id)}
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
                    message="Bạn có chắc chắn muốn xóa sản phẩm này không?"
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

export default ProductList;
