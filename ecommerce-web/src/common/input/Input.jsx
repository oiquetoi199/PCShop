import React from 'react';
import PropTypes from 'prop-types';

// Hiển thị ô nhập liệu dùng chung với nhãn và thông báo lỗi.
const Input = ({ id, name, value, onChange, error, placeholder, label, className, type }) => {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-gray-700 dark:text-white mb-2">{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={type === 'file' ? undefined : value}
        onChange={onChange}
        className={`border p-2 w-full rounded ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring ${className}`}
        placeholder={type !== 'file' ? placeholder : undefined}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
};

export default Input;
