import React from 'react';
import PropTypes from 'prop-types';
import { FaUpload } from 'react-icons/fa';

const ImageUpload = ({ images, onChange, onRemove, error, label }) => {
    return (
        <div className="col-span-1 lg:col-span-3">
            <label className="block text-gray-700 dark:text-white mb-2">{label}</label>
            <div className="flex items-center gap-4 flex-wrap">
                {images.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                        >
                            &times;
                        </button>
                    </div>
                ))}

                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500">
                    <FaUpload className="h-6 w-6 text-gray-500 mb-1" />
                    <span className="text-gray-500 text-sm">Upload</span>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={onChange}
                    />
                </label>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

ImageUpload.propTypes = {
    images: PropTypes.array.isRequired,   // Array of image files
    onChange: PropTypes.func.isRequired,  // Function to handle file change
    onRemove: PropTypes.func.isRequired,  // Function to handle file removal
    error: PropTypes.string,              // Error message
    label: PropTypes.string.isRequired,   // Label for the image upload input
};

export default ImageUpload;
