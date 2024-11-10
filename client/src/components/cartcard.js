import React, { useState } from 'react';
import './stylesheets/cartcard.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const HorizontalCard = ({ product, onQuantityChange, onDelete }) => {
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQty, setSelectedQty] = useState(0);
  
  // Handle size selection
const handleSizeClick = async (size, qty) => {
  setSelectedSize(size);
  setSelectedQty(qty); // Update available quantity for the selected size
  setQuantity(Math.min(quantity, qty)); // Ensure quantity is not greater than the available quantity
  setQuantity(1); // Reset quantity to 1 when the size changes

  try {
    // Send both the current quantity and selected size to the backend
    await onQuantityChange(product.id, 1, size); // Default quantity to 1 when changing size
  } catch (error) {
    console.error('Error updating size:', error);
    toast.error('Failed to update size');
  }
};

const handleQuantityChange = async (newQuantity) => {
  // Check if the new quantity is within the available stock
  if(!selectedSize){
    toast.warning('Select Size first');
    return;
  }
  else if (newQuantity > selectedQty ) {
    toast.warning('Quantity exceeds the available stock');
    return;
  }
  else if (newQuantity < 1) {
    toast.warning('Quantity cannot be less than 1');
    return;
  }

  setIsUpdating(true);
  try {
    // Send the new quantity to the backend with selected size
    await onQuantityChange(product.id, newQuantity, selectedSize);
    setQuantity(newQuantity);
  } catch (error) {
    console.error('Error updating quantity:', error);
    toast.error('Failed to update quantity');
  } finally {
    setIsUpdating(false);
  }
};
  

const handleDelete = async () => {
  try {
    await onDelete(product.id);
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to remove product');
  }
};

return (
  <div className="horizontal-card">
    <img 
      src={product?.images && product?.images.length > 0 ? `http://localhost:3001/uploads/${product.images[0]}` : 'http://localhost:3001/uploads/no-image.jpg'}
      alt={product?.name} 
      className="horizontal-card-image" 
    />
    <div className="horizontal-card-content">
      <div className='horizontal-card-header'>
        <h2 className="horizontal-card-title">{product?.name}</h2>
        <button className="delete-button" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="horizontal-card-info">
        <p className="horizontal-card-price">PKR {product?.price}</p>
        <div className="horizontal-card-quantity">
          <button className="quantity-button" onClick={()=> handleQuantityChange(quantity - 1)} disabled={isUpdating}>-</button>
          <span>{quantity}</span>
          <button className="quantity-button" onClick={() => handleQuantityChange(quantity + 1)} disabled={isUpdating}>+</button>
        </div>
      </div>

      {/* Display sizes if available, otherwise show "No sizes available" message */}
      {Array.isArray(product?.size) && product.size.length > 0 ? (
        <div className="gap-2 size-selection mt-3 p-0" style={{alignItems: 'center'}}>
          <p className=' p-0 m-0'>Select Size:</p>
          <div className="size-options flex flex-wrap gap-2 mt-2">
            {product.size.map((sizeObj, index) => (
              <button
                key={index}
                className={`size-button w-12 p-2 rounded ${selectedSize === sizeObj?.size ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'}`}
                onClick={() => handleSizeClick(sizeObj?.size, sizeObj?.qty)}
              >
                {sizeObj?.size}
              </button>              
            ))}
          </div>
        </div>
      ) : (
        <p className="no-sizes-message">No sizes available</p>
      )}

      {/* Quantity Info */}
      <div className="selected-quantity mt-2">
        {selectedQty ? `Items left: ${selectedQty}` : `Items left: ${product?.size?.reduce((total, item) => total + item?.qty, 0) || 'out of stock'}`}
      </div>
    </div>
  </div>
);
};

export default HorizontalCard;
