import React from "react";

// Hiển thị thanh phân trang và phát sự kiện đổi trang.
const PaginationNormal = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination mt-5 flex justify-center items-center">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 0}
                className="px-4 py-2 rounded-lg font-semibold transition duration-300 
                           bg-blue-500 text-white hover:bg-blue-600 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Trước
            </button>

            <span className="mx-4 text-gray-900 font-medium">
                {currentPage + 1} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-lg font-semibold transition duration-300 
                           bg-blue-500 text-white hover:bg-blue-600 
                           disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Tiếp theo
            </button>
        </div>
    );
};

export default PaginationNormal;
