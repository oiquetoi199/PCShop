import React from 'react';
import { Link } from 'react-router-dom';

// Hiển thị thẻ số liệu tổng quan trên trang quản trị.
const Card = ({ icon, title, value, link }) => {
  return (
    <Link to={link} className="block bg-white p-4 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex items-center">
        <div className="text-blue-500 text-2xl mr-4">
          {icon}
        </div>
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p className="text-gray-600 dark:text-gray-400">{value}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
