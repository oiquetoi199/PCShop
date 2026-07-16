import React from 'react';
import PropTypes from 'prop-types';

// Hiển thị danh sách lựa chọn và trả lại giá trị người dùng chọn.
const Select = ({ 
    id, 
    name, 
    value, 
    onChange, 
    error, 
    label, 
    options = [], 
    placeholder, 
    className = '', 
    optionKey = 'id', 
    optionValue = 'id',  
    optionLabelKey = 'name' 
}) => {
    return (
        <div className="mb-2">
            <label htmlFor={id} className="block text-gray-700 dark:text-white mb-2">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={`border p-2 w-full rounded ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:outline-none focus:ring ${className}`}
            >
                <option value="">{placeholder}</option>
                {Array.isArray(options) && options.map((option) => (
                    <option key={option[optionKey]} value={option[optionValue]}>
                        {option[optionLabelKey]}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    optionKey: PropTypes.string,
    optionValue: PropTypes.string,
    optionLabelKey: PropTypes.string,
};

export default Select;