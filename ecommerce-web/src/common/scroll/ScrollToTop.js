import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Đưa vị trí cuộn về đầu trang mỗi khi đường dẫn thay đổi.
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }, [pathname]);

    return null;
};

export default ScrollToTop;
