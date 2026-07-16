import React from 'react';
import PropTypes from 'prop-types';

// Hiển thị lựa chọn radio và chuyển giá trị đã chọn về component cha.
const RadioButton = ({ id, name, value, onChange, checked, label, className, classNameLabel, error }) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`${className} ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
      />
      <label htmlFor={id} className={`ml-2 ${classNameLabel}`}>
        {label}
      </label>
      {error && <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>}
    </div>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
};

export default RadioButton;
