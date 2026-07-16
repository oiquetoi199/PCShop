import React from 'react';
import PropTypes from 'prop-types';

// Hiển thị ô chọn và đồng bộ trạng thái với dữ liệu biểu mẫu.
const CheckBox = ({ id, name, checked, onChange, error, labelForm, lableCheckBox, className }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 dark:text-white mb-2">{labelForm}</label>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className={`mr-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring ${className}`}
        />
        <label htmlFor={id} className="text-gray-700 dark:text-white">{lableCheckBox}</label>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  labelForm: PropTypes.string,
  lableCheckBox: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default CheckBox;
