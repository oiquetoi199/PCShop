import React from 'react';

// Hiển thị nút dùng chung và chuyển tiếp sự kiện nhấn cho component cha.
const Button = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
};

export default Button;
