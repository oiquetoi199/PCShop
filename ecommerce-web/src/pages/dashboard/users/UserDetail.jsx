import React, { useState, useEffect } from 'react';
import Modal from '../../../common/alert/Modal';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../common/input/Input';
import Select from '../../../common/select/Select';
import Button from '../../../common/button/Button';

// Hiển thị chi tiết tài khoản và quyền của người dùng.
const UserDetail = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        phone: '',
        role: '',
        email: '',
        address: '',
        province: '',
        district: '',
        ward: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({
        username: '',
        fullName: '',
        phone: '',
        role: '',
        email: '',
        address: '',
        province: '',
        district: '',
        ward: ''
    });
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const navigate = useNavigate();
    const [responseText, setResponseText] = useState('');
    const [user, setUser] = useState(null);
    const { id } = useParams();

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

        if (responseText === 'expired') {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('roles');
            setUser(null);
            navigate('/');
        }
    };

    useEffect(() => {
        // Gọi API để tải thông tin tài khoản người dùng được chọn.
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/user/detail/${id}`, {
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
                setUser(data);
                setFormData({
                    username: data.username || '',
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    role: data.roleId || '',
                    email: data.email || '',
                    address: data.address || '',
                    province: data.province || '',
                    district: data.district || '',
                    ward: data.wards || '',
                });
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    useEffect(() => {
        // Gọi API để tải danh sách vai trò có thể gán cho người dùng.
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/user/roles`, {
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
                setRoles(data);
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu vai trò.', true);
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
        // Tải danh sách tỉnh hoặc thành phố để người dùng chọn địa chỉ.
        const fetchProvinces = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu tỉnh/thành phố.', true);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        // Tải danh sách quận hoặc huyện theo tỉnh, thành phố đã chọn.
        const fetchDistricts = async () => {
            if (formData.province) {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/p/${formData.province}?depth=2`);
                    const data = await response.json();
                    setDistricts(data.districts);
                } catch (error) {
                    openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu quận/huyện.', true);
                }
            } else {
                setDistricts([]);
                setWards([]);
            }
        };
        fetchDistricts();
    }, [formData.province]);

    useEffect(() => {
        // Tải danh sách phường hoặc xã theo quận, huyện đã chọn.
        const fetchWards = async () => {
            if (formData.district) {
                try {
                    const response = await fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`);
                    const data = await response.json();
                    setWards(data.wards);
                } catch (error) {
                    openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu xã/phường.', true);
                }
            } else {
                setWards([]);
            }
        };
        fetchWards();
    }, [formData.district]);

    // Cập nhật dữ liệu biểu mẫu theo trường nhập liệu vừa thay đổi.
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    // Kiểm tra dữ liệu người dùng nhập trước khi tiếp tục xử lý.
    const validate = () => {
        let valid = true;
        const newErrors = {
            username: '',
            fullName: '',
            phone: '',
            role: '',
            email: '',
            address: '',
            province: '',
            district: '',
            ward: ''
        };

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ và tên là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số)';

        if (!formData.role) {
            newErrors.role = 'Quyền là bắt buộc';
        }

        if (!formData.address) {
            newErrors.address = 'Địa chỉ là bắt buộc';
        }

        if (!formData.province) {
            newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
        }

        if (!formData.district) {
            newErrors.district = 'Vui lòng chọn Quận/Huyện';
        }

        if (!formData.ward) {
            newErrors.ward = 'Vui lòng chọn Phường/Xã';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };


    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);

            const dataToSubmit = {
                id: user.id,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                roleId: Number(formData.role),
                address: formData.address,
                wards: formData.ward,
                district: formData.district,
                province: formData.province,
            };

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${apiUrl}/user/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSubmit)
                });

                if (response.status === 401) {
                    const message = await response.text();
                    setResponseText(message);
                    openModal('Thông báo', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.', true);
                    setLoading(false);
                    return;
                }

                const responseData = await response.json();

                if (responseData && responseData.message === 'saved') {
                    openModal('Thông báo', 'Lưu thành công.', false);

                    setUser({ ...user, ...dataToSubmit });
                } else {
                    openModal('Thông báo', 'Lưu không thành công.', true);
                }
            } catch (error) {
                openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật dữ liệu. Vui lòng thử lại sau.', true);
            } finally {
                setLoading(false);
            }
        }
    };

    // Đặt lại dữ liệu biểu mẫu về trạng thái ban đầu.
    const handleReset = () => {
        setFormData({
            username: user.username || '',
            fullName: user.fullName || '',
            phone: user.phone || '',
            role: user.roleId || '',
            email: user.email || '',
            address: user.address || '',
            province: user.province || '',
            district: user.district || '',
            ward: user.wards || '',
        });
    };

    return (
        <LoadingLayout loading={loading}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg max-w-2xl w-full p-6 space-y-4">
                    <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        label="Họ và tên"
                        error={errors.fullName}
                        placeholder="Nhập họ và tên"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                    />

                    <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        label="Email"
                        error={errors.email}
                        placeholder="Nhập email"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                    />

                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        label="Số điện thoại"
                        error={errors.phone}
                        placeholder="Nhập số điện thoại"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                    />

                    <Select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        error={errors.role}
                        options={roles}
                        placeholder="Chọn quyền"
                        label="Quyền"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                    />

                    <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        label="Địa chỉ"
                        error={errors.address}
                        placeholder="Nhập địa chỉ"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                    />

                    <Select
                        id="province"
                        name="province"
                        label="Tỉnh/ Thành phố"
                        value={formData.province}
                        onChange={handleInputChange}
                        error={errors.province}
                        options={provinces}
                        placeholder="Chọn Tỉnh/ thành phố"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                    />

                    <Select
                        id="district"
                        name="district"
                        label="Quận/ Huyện"
                        value={formData.district}
                        onChange={handleInputChange}
                        error={errors.district}
                        options={districts}
                        placeholder="Chọn Quận/ Huyện"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                        disabled={!formData.province}
                    />

                    <Select
                        id="ward"
                        name="ward"
                        label="Phường/ Xã"
                        value={formData.ward}
                        onChange={handleInputChange}
                        error={errors.ward}
                        options={wards}
                        placeholder="Chọn Phường/ Xã"
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                        disabled={!formData.district}
                    />

                    <div className="flex space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none px-4"
                        >
                            Cập nhật
                        </Button>
                        <Button
                            onClick={() => {
                                handleReset();
                                closeModal();
                            }}
                            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded py-2 px-4 hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                            Hủy
                        </Button>
                    </div>

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

export default UserDetail;