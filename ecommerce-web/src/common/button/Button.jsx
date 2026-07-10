import React from 'react';

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
