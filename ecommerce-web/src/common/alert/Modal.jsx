import React from 'react';

const Modal = ({ isOpen, onClose, title, message, isError }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 ${isError ? 'border-red-500' : 'border-green-500'} border`}>
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div>
          <p className={isError ? 'text-red-600' : 'text-green-600'}>
            {message}
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
