import React from "react";

const PaginationDarkMode = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination mt-5 flex justify-center items-center">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 0}
                className="px-4 py-2 rounded-lg font-semibold transition duration-300 
                           bg-blue-500 text-white hover:bg-blue-600 
                           disabled:bg-gray-400 disabled:cursor-not-allowed 
                           dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                Trước
            </button>

            <span className="mx-4 text-gray-900 dark:text-gray-100 font-medium">
                {currentPage + 1} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-lg font-semibold transition duration-300 
                           bg-blue-500 text-white hover:bg-blue-600 
                           disabled:bg-gray-400 disabled:cursor-not-allowed 
                           dark:bg-blue-700 dark:hover:bg-blue-800"
            >
                Tiếp theo
            </button>
        </div>
    );
};

export default PaginationDarkMode;
