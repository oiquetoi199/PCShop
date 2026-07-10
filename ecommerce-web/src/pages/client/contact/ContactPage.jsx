import React, { useState, useEffect } from 'react';
import Modal from '../../../common/alert/Modal';
import Input from '../../../common/input/Input';
import Select from '../../../common/select/Select';
import TextArea from '../../../common/input/TextArea';
import Button from '../../../common/button/Button';
import LoadingLayout from '../../../common/loading/LoadingLayout';

const ContactPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: '',
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (title, message, error) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsError(error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name == "province") {
      const selectedProvince = provinces.find(province => province.code == value);
      const provinceName = selectedProvince ? selectedProvince.name : '';
      setProvince(provinceName);
    } else if (name == "district") {
      const selectDistrict = districts.find(district => district.code == value);
      const districtName = selectDistrict ? selectDistrict.name : '';
      setDistrict(districtName);
    } else if (name == "ward") {
      const selectWard = wards.find(ward => ward.code == value);
      const wardName = selectWard ? selectWard.name : '';
      setWard(wardName);
    }

    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Họ và tên là bắt buộc';
    if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ (10 chữ số)';
    if (!formData.address) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!formData.province) newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
    if (!formData.district) newErrors.district = 'Vui lòng chọn Quận/Huyện';
    if (!formData.ward) newErrors.ward = 'Vui lòng chọn Phường/Xã';
    if (formData.note && formData.note.length > 500) newErrors.note = 'Ghi chú không được quá 500 ký tự';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      openModal('Lỗi xác thực', 'Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc.', true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
        setLoading(true);

        const dataToSubmit = {
            fullName: formData.fullName,
            phone: formData.phone,
            address: `${formData.address} - ${ward} - ${district} - ${province}`,
            note: formData.note,
        };
        
        try {
            const response = await fetch(`${apiUrl}/contact/guest/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(dataToSubmit),
            });

            const responseData = await response.json();

            if (responseData && responseData.message === "saved") {
                openModal('Thông báo', 'Gửi thông tin thành công.', false);
                handleCancel();
            } else {
                openModal('Thông báo', 'Gửi thông tin không thành công.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại sau.', true);
        } finally {
            setLoading(false);
        }
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      province: '',
      district: '',
      ward: '',
      note: '',
    });
    setErrors({});
  };

  return (
    <LoadingLayout loading={loading}>
        <div className="flex justify-center items-center min-h-screen px-4 bg-gray-100 mb-2">
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
                <TextArea
                    id="note"
                    name="note"
                    label="Ghi chú"
                    value={formData.note}
                    onChange={handleInputChange}
                    error={errors.note}
                    placeholder="Nhập ghi chú"
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                />
                
                <div className="flex justify-between space-x-4">
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Gửi thông tin
                    </Button>
                    <Button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Hủy
                    </Button>
                </div>

                <div className="border border-orange-500 bg-orange-100 text-orange-800 text-sm p-4 rounded mt-5">
                    Chúng tôi sẽ LIÊN HỆ lại bằng TIN NHẮN SMS hoặc GỌI ĐIỆN. Bạn vui lòng kiểm tra TIN NHẮN hoặc NGHE MÁY sau khi gửi thông tin liên hệ.
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

export default ContactPage;