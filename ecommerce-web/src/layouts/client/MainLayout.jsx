import { useState } from "react";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import Navbar from "../../components/client/Navbar";
import Footer from "../../components/client/Footer";
import { Outlet } from "react-router-dom";
// import FloatingContact from "../../components/client/FloatingContact.jsx";
import Search from "../../components/client/Search";

// Bố trí giao diện chung cho khu vực khách hàng.
const MainLayout = () => {
    const [loginPopup, setLoginPopup] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");

    // Mở hoặc đóng cửa sổ đăng nhập theo thao tác của người dùng.
    const handleLoginPopup = () => {
        setLoginPopup(!loginPopup);
    };

    // Lưu kết quả đăng nhập và cập nhật giao diện sau khi xác thực thành công.
    const handleLoginSuccess = (username) => {
        setUsername(username);
        localStorage.setItem("username", username);
        setLoginPopup(false);
    };

    return (
        <div className="overflow-x-hidden bg-white text-dark relative">
            <div className="relative">
                <Navbar handleLoginPopup={handleLoginPopup} username={username} setUsername={setUsername} />
            </div>

            <div>
                <Search/>
            </div>
            
            <div className="mt-16 sm:mt-32">
                <Outlet context={{ username, handleLoginSuccess, handleLoginPopup, setUsername, searchText: 'abcxyz' }} />
            </div>
            {/* <FloatingContact /> */}
            <Footer />
            {loginPopup && (
                <LoginPopup
                    loginPopup={loginPopup}
                    handleLoginPopup={handleLoginPopup}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
};

export default MainLayout;