import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({ id, name, value, onChange, error, placeholder, label, className, rows }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 dark:text-white mb-2">{label}</label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`border p-2 w-full rounded ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring ${className}`}
        placeholder={placeholder}
        rows={rows} // Allow customizable row height
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  rows: PropTypes.number, 
};

export default TextArea;
