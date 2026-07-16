import React from "react";
import SpinnerLoad from "../loading/SpinnerLoad";

// Hiển thị lớp phủ tải dữ liệu trong thời gian chờ xử lý.
const LoadingLayout = ({ loading, children }) => {
    return (
        <>
            {loading ? (
                <div className="flex flex-col justify-center items-center w-full min-h-screen">
                    <div className="flex justify-center items-center w-full h-full">
                        <SpinnerLoad />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="w-full h-full">
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default LoadingLayout;
