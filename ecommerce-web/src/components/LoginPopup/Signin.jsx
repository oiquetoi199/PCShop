import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "../../common/alert/Modal";
import SpinnerLoad from "../../common/loading/SpinnerLoad";

const apiUrl = import.meta.env.VITE_API_URL;

const Signin = ({ handleSignIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titleMessage, setTitleModalMessage] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Tên đăng nhập là bắt buộc";
        if (!formData.email) newErrors.email = "Email là bắt buộc";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
        if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
        else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const openModal = (title, message, error) => {
        setTitleModalMessage(title);
        setModalMessage(message);
        setIsError(error);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);

            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            setLoading(false);

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.message === "saved") {
                    openModal("Đăng ký thành công", "Tài khoản của bạn đã được tạo thành công!", false);
                    setTimeout(() => {
                    }, 2000);
                } else {
                    openModal("Đăng ký thất bại", "Không thể tạo tài khoản, vui lòng thử lại.", true);
                }
            } else if (response.status === 409) {
                const responseData = await response.json();
                if (responseData.errorKey === "USERNAME_TAKEN") {
                    openModal("Đăng ký thất bại", "Tên  nhập đã tồn tại, vui lòng chọn tên khác.", true);
                } else {
                    openModal("Đăng ký thất bại", "Không thể tạo tài khoản, vui lòng thử lại.", true);
                }
            } else {
                openModal("Lỗi hệ thống", "Có lỗi xảy ra, vui lòng thử lại sau.", true);
            }
        }
    };

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
                <h1 className="text-3xl text-shadow text-white font-bold text-center mb-4">
                    Tạo tài khoản
                </h1>
                <form className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="username" className="input-label">
                            Tên đăng nhập
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="input"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p className="text-red-500">{errors.username}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="input-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="input-label">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                className="input pr-8"
                                id="password"
                                name="password"
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
                    <button type="button" className="primary-btn" onClick={handleSubmit}>
                        Tạo tài khoản
                    </button>
                </form>
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
                    Bạn đã có tài khoản? Đăng nhập
                </p>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={titleMessage}
                message={modalMessage}
                isError={isError}
            />
        </div>
    );
};

export default Signin;