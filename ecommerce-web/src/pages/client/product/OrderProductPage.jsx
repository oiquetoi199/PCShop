import React, { useState, useEffect } from 'react';
import Modal from '../../../common/alert/Modal';
import Input from '../../../common/input/Input';
import Select from '../../../common/select/Select';
import TextArea from '../../../common/input/TextArea';
import Button from '../../../common/button/Button';
import LoadingLayout from '../../../common/loading/LoadingLayout';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { formatLargeNumber } from '../../../utils/FormatUtils';
import { FaTrashAlt } from 'react-icons/fa';

// Hiển thị biểu mẫu đặt hàng và xử lý xác nhận đơn hàng.
const OrderProductPage = () => {
  const location = useLocation();
  const { cartProducts, cartTotalQuantity, cartTotalPrice, action } = location.state || {};
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartProducts || cartProducts.length === 0) {
      navigate('/');
    }
  }, [cartProducts, navigate]);

  if (!cartProducts || cartProducts.length === 0) {
    return null;
  }

  const [cartState, setCartState] = useState({
    cartProducts: cartProducts || [],
    cartTotalQuantity: cartTotalQuantity || 0,
    cartTotalPrice: cartTotalPrice || 0,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'COD',
    discountCode: ''
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
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [payment, setPayment] = useState(cartState.cartTotalPrice + deliveryPrice);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const { username, setUsername } = useOutletContext();

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

    if (!isError) {
      navigate("/my-orders")
    }

    if (responseText == "expired") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("roles");
      setUsername(null);
      navigate("/");
    }
  };

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

  useEffect(() => {
          // Gọi API để tải thông tin người dùng hiện tại và điền vào biểu mẫu đặt hàng.
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
  
                  setFormData({
                      fullName: data.fullName || '',
                      phone: data.phone || '',
                      email: data.email || '',
                      address: data.address || '',
                      province: data.province || '',
                      district: data.district || '',
                      ward: data.wards || '',
                      note : '',
                      paymentMethod: 'COD',
                      discountCode: ''
                  });
              } catch (error) {
                  openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
              } finally {
                  setLoading(false);
              }
          };
          fetchUser();
      }, []);

  // Cập nhật dữ liệu biểu mẫu theo trường nhập liệu vừa thay đổi.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
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
    if (formData.note && formData.note.length > 500) newErrors.note = 'Ghi chú không được quá 500 ký tự';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      openModal('Lỗi xác thực', 'Vui lòng kiểm tra lại thông tin và điền đầy đủ các trường bắt buộc.', true);
      return false;
    }

    return true;
  };

  // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
  const handleSubmit = async () => {
    if (validateForm()) {
        setLoading(true);

        const wardName = wards.find(ward => ward.code == formData.ward)?.name || "";
        const districtName = districts.find(district => district.code == formData.district)?.name || "";
        const provinceName = provinces.find(province => province.code == formData.province)?.name || "";

        const dataToSubmit = {
            fullName: formData.fullName,
            phone: formData.phone,
            address: `${formData.address} - ${wardName} - ${districtName} - ${provinceName}`,
            deliveryPrice: deliveryPrice,
            cartTotalPrice: cartState.cartTotalPrice,
            cartTotalQuantity: cartState.cartTotalQuantity,
            paymentAmount: payment,
            note: formData.note,
            cartProducts: cartState.cartProducts, 
        };
        
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${apiUrl}/order-product/save`, {
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
                openModal('Thông báo', 'Đặt hàng thành công.', false);
            } else {
                openModal('Thông báo', 'Đặt hàng không thành công.', true);
            }
        } catch (error) {
            openModal('Lỗi', 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.', true);
        } finally {
            setLoading(false);
        }
    }
  };

  // Cập nhật số lượng sản phẩm và tính lại dữ liệu giỏ hàng.
  const handleQuantityChange = async (id, delta) => {
    if (action == 0) {
      try {
        setLoading(false);
        const token = localStorage.getItem('token');
        const updatedProduct = cartState.cartProducts.find((item) => item.id === id);
        
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
    } else {
      const updatedProduct = cartState.cartProducts.find((item) => item.id === id);

      if (!updatedProduct) return;

      const newQuantity = Math.max(updatedProduct.quantity + delta, 1);

      const priceToUse = updatedProduct.saleRate > 0 
        ? updatedProduct.newPrice
        : updatedProduct.price;

      const updatedCartProducts = cartState.cartProducts.map((item) => 
        item.id === id ? { 
          ...item, 
          quantity: newQuantity, 
          totalPrice: priceToUse * newQuantity
        } : item
      );

      const cartTotalQuantity = updatedCartProducts.reduce((total, item) => total + item.quantity, 0);
      const cartTotalPrice = updatedCartProducts.reduce((total, item) => total + item.totalPrice, 0);

      setCartState({
        cartProducts: updatedCartProducts,
        cartTotalQuantity: cartTotalQuantity,
        cartTotalPrice: cartTotalPrice,
      });
    } 
  };

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

        setCartState({
          cartProducts: data.cartProducts,
          cartTotalQuantity: data.cartTotalQuantity,
          cartTotalPrice: data.cartTotalPrice,
        });
    } catch (error) {
        openModal('Lỗi', 'Đã xảy ra lỗi khi tải dữ liệu.', true);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
  if (cartState.cartProducts.length > 0) {
    setPayment(cartState.cartTotalPrice + deliveryPrice);
  } else {
    navigate("/")
  }
}, [cartState]);

useEffect(() => {
  if (action == 0) {
    fetchCartData();
  }
}, []);

  // Xóa trực tiếp sản phẩm được chọn khỏi giỏ hàng trong bước đặt hàng.
  const handleDelete = async (id) => {
    if (action == 0) {
      try {
        setLoading(false);
        const token = localStorage.getItem('token');

        const response = await fetch(`${apiUrl}/cart-product/delete/${id}`, {
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

        const data = await response.json();

        if (data && data.message === "success") {
          fetchCartData();
        } else {
            openModal('Lỗi', 'Đã xảy ra lỗi khi cập nhật sản phẩm.', true);
        }
      } catch (error) {
          openModal('Lỗi', 'Không thể kết nối đến server. Vui lòng thử lại sau.', true);
      } finally {
          setLoading(false);
      }
    } else {
      const updatedCartProducts = cartState.cartProducts.filter((item) => item.id !== id);

      const cartTotalQuantity = updatedCartProducts.reduce((total, item) => total + item.quantity, 0);
      const cartTotalPrice = updatedCartProducts.reduce((total, item) => 
        total + (item.saleRate > 0 ? item.newPrice * item.quantity : item.price * item.quantity), 0
      );

      setCartState({
        cartProducts: updatedCartProducts,
        cartTotalQuantity: cartTotalQuantity,
        cartTotalPrice: cartTotalPrice,
      });
      
    }
  };

  return (
    <LoadingLayout loading={loading}>
      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex lg:space-x-8">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>
            <form className="space-y-4">
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
                  placeholder="Chọn Quận/ Huyện"
                  className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                  optionKey="code"
                  optionValue="code"
                  optionLabelKey="name"
                  disabled={!formData.province}
                />
              </div>
              <Select
                id="ward"
                name="ward"
                label="Phường/ Xã"
                value={formData.ward}
                onChange={handleInputChange}
                error={errors.ward}
                options={wards}
                placeholder="Chọn Phường/ Xã"
                className="bg-gray-50 text-gray-900 border border-gray-300 rounded p-2"
                optionKey="code"
                optionValue="code"
                optionLabelKey="name"
                disabled={!formData.district}
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
                rows={4}
              />
              <h3 className="text-lg font-semibold mt-6">Phương thức thanh toán</h3>
              <div className="border border-gray-300 rounded-md p-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleInputChange}
                    className="text-blue-500 focus:ring focus:ring-blue-500"
                  />
                  <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <ul className="ml-6 list-disc text-sm text-gray-600 mt-2">
                  <li>Free ship cho đơn hàng lớn.</li>
                  <li>Kiểm hàng thoải mái trước khi thanh toán.</li>
                  <li>Hỗ trợ đổi hàng.</li>
                </ul>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="border border-gray-300 p-4 rounded-md space-y-4">
            {cartState.cartProducts.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <img src={`data:image/jpeg;base64,${item.image}`} alt="Product" className="w-20 h-20 object-cover" />
                <div className="flex-1">
                  <p className="text-gray-800">{item.productName} - {item.productType}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="px-2 py-1 border border-gray-300 rounded">-</button>
                    <p className="text-lg">{item.quantity}</p>
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="px-2 py-1 border border-gray-300 rounded">+</button>
                    <span className="ml-auto text-gray-800 font-semibold">{formatLargeNumber(item.totalPrice)}</span>
                  </div>
                  <div className="mt-2">
                  {item.newPrice > 0 ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 font-semibold">{formatLargeNumber(item.newPrice)}</span>
                      <span className="line-through text-gray-500">{formatLargeNumber(item.price)}</span>
                    </div>
                  ) : (
                    <span className="text-gray-800 font-semibold">{formatLargeNumber(item.price)}</span>
                  )}
                </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
               ))}
              {/* <Input
                id="discountCode"
                name="discountCode"
                label=""
                value={formData.discountCode}
                onChange={handleInputChange}
                placeholder="Mã giảm giá"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
              />
              <Button>Sử dụng</Button> */}
              {/* <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-gray-800">{deliveryPrice.toLocaleString('vi-VN')}₫</span>
              </div> */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                <span className="text-gray-800 font-semibold">Tổng cộng</span>
                <span className="text-gray-800 font-semibold">{formatLargeNumber(payment)}</span>
              </div>
              <div className="border border-orange-500 bg-orange-100 text-orange-800 text-sm p-4 rounded">
                Chúng tôi sẽ XÁC NHẬN đơn hàng bằng TIN NHẮN SMS hoặc GỌI ĐIỆN. Bạn vui lòng kiểm tra TIN NHẮN hoặc NGHE MÁY ngay khi đặt hàng thành công và CHỜ NHẬN HÀNG
              </div>
              <Button onClick={handleSubmit}>Hoàn tất đơn hàng</Button>
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
      </div>
    </LoadingLayout>
  );
};

export default OrderProductPage;
