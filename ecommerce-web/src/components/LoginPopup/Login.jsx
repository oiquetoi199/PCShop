import { useState } from "react";
import { FaEye, FaEyeSlash, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import LoadingLayout from "../../common/loading/LoadingLayout";
import Modal from "../../common/alert/Modal";
import SpinnerLoad from "../../common/loading/SpinnerLoad";

const apiUrl = import.meta.env.VITE_API_URL;

// Hiển thị biểu mẫu đăng nhập và điều phối quá trình xác thực.
const Login = ({ handleSignIn, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Kiểm tra dữ liệu người dùng nhập trước khi tiếp tục xử lý.
    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Tên đăng nhập là bắt buộc";
        if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Cập nhật state khi giá trị của trường nhập liệu thay đổi.
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        setErrors({
            ...errors,
            [id]: '',
        });
    };

    // Mở hộp thoại và thiết lập tiêu đề, nội dung cùng trạng thái hiển thị.
    const openModal = (message, error) => {
        setModalMessage(message);
        setIsError(error);
        setIsModalOpen(true);
    };

    // Xử lý gửi biểu mẫu, gọi API tương ứng và thông báo kết quả.
    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);

            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            setLoading(false);

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("username", responseData.username);
                localStorage.setItem("roles", responseData.roles);

                onLoginSuccess(responseData.username);
            } else {
                openModal("Tên đăng nhập hoặc mật khẩu không đúng", true);
            }
        }
    };

    // Đóng hộp thoại và thực hiện xử lý bổ sung sau khi đóng nếu cần.
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <SpinnerLoad />
                </div>
            )}
            <div className={`p-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
                <h1 className="text-3xl text-white font-bold text-center mb-4 text-shadow">
                    Đăng nhập
                </h1>
                <form className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="username" className="input-label">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="input"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p className="text-red-500">{errors.username}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="input-label">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                className="input pr-8"
                                id="password"
                                autoComplete="off"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {showPassword ? (
                                <FaEye
                                    className="text-white absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            ) : (
                                <FaEyeSlash
                                    className="text-white absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            )}
                        </div>
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                    </div>
                </form>
                <button className="primary-btn" onClick={handleSubmit}>Đăng nhập</button>

                {/* <p className="text-center text-white text-sm my-3">hoặc đăng nhập với</p>
                <div className="flex gap-6 justify-center">
                    <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shadow-custom-inset hover:scale-110 transition-all duration-300">
                        <FcGoogle className="text-3xl" />
                    </div>
                    <div className="bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center shadow-custom-inset hover:scale-110 transition-all duration-300">
                        <FaLinkedinIn className="text-2xl text-white" />
                    </div>
                </div> */}

                <p
                    className="text-center text-white text-sm my-3 hover:text-lime-100 cursor-pointer text-shadow"
                    onClick={handleSignIn}
                >
                    Không có tài khoản? Tạo tài khoản ở đây
                </p>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                message={modalMessage}
                isError={isError}
            />
        </div>
    );
};

export default Login;