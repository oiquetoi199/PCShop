import React, { useState } from 'react';
import Button from '../../common/button/Button';

const ProductContact = ({ product, onContactNow }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);

  return (
    <div className="container mx-auto p-4 max-w-7xl flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Product"
            className="w-full h-auto object-cover rounded shadow-lg"
          />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.productImageList.map((imgObj, index) => (
              <img
                key={imgObj.id}
                src={`data:image/jpeg;base64,${imgObj.imageData}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover cursor-pointer border ${selectedImage === imgObj.imageData ? 'border-black' : 'border-gray-200'} rounded`}
                onClick={() => setSelectedImage(imgObj.imageData)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800">{product.productName}</h1>
          <p className="text-green-600 font-medium">Còn hàng</p>
          <div className="flex items-center gap-4">
            <p className="text-xl lg:text-3xl font-bold text-red-500">Liên hệ ngay để biết thêm thông tin</p>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium">Thông tin sản phẩm</p>
            {product.productInfo && (
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: product.productInfo }} />
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <Button onClick={() => onContactNow(product)} className="w-full lg:w-auto flex-1 py-3 bg-green-600 hover:bg-green-700">
              Liên hệ ngay
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-700">Mô tả sản phẩm</h2>
        {product.description && (
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: product.description }} />
        )}
      </div>
    </div>
  );
};

export default ProductContact;
