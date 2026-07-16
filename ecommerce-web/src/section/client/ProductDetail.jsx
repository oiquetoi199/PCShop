import React, { useState, useEffect } from 'react';
import Button from '../../common/button/Button';
import { formatLargeNumber } from "../../utils/FormatUtils";
import RadioButton from '../../common/input/RadioButton';

// Hiển thị thông tin chi tiết, giá và thao tác mua sản phẩm.
const ProductDetail = ({ product, onAddToCart, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedProductType, setSelectedProductType] = useState(""); 
  const [totalPrice, setTotalPrice] = useState(product.newPrice > 0 ? product.newPrice : product.price);

  // Cập nhật số lượng sản phẩm và tính lại dữ liệu giỏ hàng.
  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(1, prevQuantity + amount);
      return newQuantity;
    });
  };

  useEffect(() => {
    const pricePerItem = product.newPrice > 0 ? product.newPrice : product.price;
    setTotalPrice(pricePerItem * quantity);
  }, [quantity, product.newPrice, product.price]);

  // Cập nhật dữ liệu của loại sản phẩm đang được chỉnh sửa.
  const handleProductTypeChange = (e) => {
    setSelectedProductType(e.target.value);
  };

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
          {
            product.newPrice > 0 ? (
              <div className="flex items-center gap-4">
                <p className="text-xl lg:text-3xl font-bold text-red-500">{formatLargeNumber(product.newPrice)}</p>
                {product.price && (
                  <p className="text-lg lg:text-2xl line-through text-gray-400">{formatLargeNumber(product.price)}</p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-xl lg:text-3xl font-bold text-red-500">{formatLargeNumber(product.price)}</p>
              </div>
            )
          }
          <div className="space-y-1">
            <p className="text-lg font-medium">Thông tin sản phẩm</p>
            {product.productInfo && (
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: product.productInfo }} />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium">Số lượng</p>
            <div className="flex items-center gap-2">
              <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 border">-</button>
              <p className="text-lg">{quantity}</p>
              <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 border">+</button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium">Chọn loại sản phẩm</p>
            <div className="flex flex-wrap gap-4">
              {product.productTypes.map((type) => (
                <RadioButton
                  key={type.id}
                  id={`productType-${type.id}`}
                  name="productType"
                  value={type.name}
                  onChange={handleProductTypeChange}
                  label={type.name}
                  checked={selectedProductType === type.name}
                  classNameLabel = "text-gray-700"
                  className="cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium">Tổng giá</p>
            <p className="text-xl lg:text-2xl font-bold text-red-500">{formatLargeNumber(totalPrice)}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <Button onClick={() => onAddToCart(product, quantity, selectedProductType, totalPrice)} className="w-full lg:w-auto flex-1 py-3">
              Thêm vào giỏ hàng
            </Button>
            <Button onClick={() => onBuyNow(product, quantity, selectedProductType, totalPrice)} className="w-full lg:w-auto flex-1 py-3 bg-green-600 hover:bg-green-700">
              Mua ngay
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

export default ProductDetail;
