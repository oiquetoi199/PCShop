import React, { useState, useEffect } from 'react';
import Modal from '../../../common/alert/Modal';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Input from '../../../common/input/Input';
import Select from '../../../common/select/Select';
import Button from '../../../common/button/Button';

// Hiển thị và cho phép cập nhật thông tin của người dùng hiện tại.
const UserInfo = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        province: '',
        district: '',
        ward: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [errors, setErrors] = useState({});
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [responseText, setResponseText] = useState('');
    const { username, setUsername } = useOutletContext();
    const [user, setUser] = useState(null);

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
            setUsername(null);
            navigate('/');
        }
    };

    useEffect(() => {
        // Gọi API để tải thông tin của người dùng hiện tại.
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`${apiUrl}/user/detail-username`, {
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
                    fullName: data.fullName || '',
                    phone: data.phone || '',
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

    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true);

            const dataToSubmit = {
                id: user.id,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
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
                openModal('Lỗi', 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.', true);
            } finally {
                setLoading(false);
            }
        }
    };

    // Kiểm tra tính hợp lệ của toàn bộ dữ liệu trong biểu mẫu.
    const validateForm = () => {
        const newErrors = {};
    
        if (!formData.fullName) newErrors.fullName = 'Họ và tên là bắt buộc';
        if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số)';
        if (!formData.address) newErrors.address = 'Địa chỉ là bắt buộc';
        if (!formData.province) newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
        if (!formData.district) newErrors.district = 'Vui lòng chọn Quận/Huyện';
        if (!formData.ward) newErrors.ward = 'Vui lòng chọn Phường/Xã';
    
        if (!formData.email) newErrors.email = 'Email là bắt buộc';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) {
            openModal('Lỗi xác thực', 'Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc.', true);
            return false;
        }
    
        return true;
    };
    

    // Hủy thao tác hiện tại và khôi phục trạng thái phù hợp.
    const handleCancel = () => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          address: '',
          province: '',
          district: '',
          ward: '',
        });
        setErrors({});
      };

    return (
        <LoadingLayout loading={loading}>
            <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100 mb-2 mt-1">
                <div className="w-full max-w-3xl sm:max-w-3xl md:max-w-xl p-6 bg-white rounded-lg shadow-md mt-2">
                    <h2 className="text-xl font-semibold mb-6 text-center">Thông tin liên hệ</h2>
                    <Input
                        id="fullName"
                        name="fullName"
                        label="Họ và tên"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        error={errors.fullName}
                        placeholder="Nhập họ và tên"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                    />
                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        placeholder="Nhập email"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                    />
                    <Input
                        id="phone"
                        name="phone"
                        label="Số điện thoại"
                        value={formData.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                        placeholder="Nhập số điện thoại"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                        type="text"
                    />
                    <Input
                        id="address"
                        name="address"
                        label="Địa chỉ"
                        value={formData.address}
                        onChange={handleInputChange}
                        error={errors.address}
                        placeholder="Nhập địa chỉ"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                        type="text"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                        id="province"
                        name="province"
                        label="Tỉnh/ Thành phố"
                        value={formData.province}
                        onChange={handleInputChange}
                        error={errors.province}
                        options={provinces}
                        placeholder="Chọn Tỉnh/ thành phố"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
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
                        placeholder="Chọn Quận/Huyện"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                        />
                    </div>
                    <Select
                        id="ward"
                        name="ward"
                        label="Phường/Xã"
                        value={formData.ward}
                        onChange={handleInputChange}
                        error={errors.ward}
                        options={wards}
                        placeholder="Chọn Phường/Xã"
                        className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                        optionKey="code"
                        optionValue="code"
                        optionLabelKey="name"
                    />
                    
                    <div className="flex justify-between space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Lưu thông tin
                        </Button>
                        <Button
                            onClick={handleCancel}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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

export default UserInfo;
