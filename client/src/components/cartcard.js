import React, { useState} from 'react';
import './stylesheets/cartcard.css';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const HorizontalCard = ({ product, onQuantityChange, onDelete  }) => {

    const [quantity, setQuantity] = useState(product.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    
    
    const handleIncrement = async () => {
      const newQuantity = quantity + 1;
      setIsUpdating(true);
      try {
        if(newQuantity > product.qty){
          toast.warning('Quantity exceeds the available stock');
          return;
        }
        else{
          await onQuantityChange(product.id, newQuantity);
          setQuantity(newQuantity);
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      } finally {
        setIsUpdating(false);
      }
    };
  
    const handleDecrement = async () => {
      if (quantity > 1) {
        const newQuantity = quantity - 1;
        setIsUpdating(true);
        try {
          await onQuantityChange(product.id, newQuantity);
          setQuantity(newQuantity);
        } catch (error) {
          console.error('Error updating quantity:', error);
        } finally {
          setIsUpdating(false);
        }
      }
    };
    
    const handleDelete = async () => {
      try {
          await onDelete(product.id);
          // toast.success('Product removed from cart');
      } catch (error) {
          console.error('Error deleting product:', error);
          toast.error('Failed to remove product');
      }
  };


  return (
    <div className="horizontal-card">
      <img 
      src={product.images && product.images.length > 0 ? `http://localhost:3001/uploads/${product.images[0]}` : 'https://via.placeholder.com/300'}
      alt={product.name} className="horizontal-card-image" />
      <div className="horizontal-card-content">
        <div className='horizontal-card-header'>
          <h2 className="horizontal-card-title">{product.name}</h2>
          <button className="delete-button" onClick={handleDelete}><FontAwesomeIcon icon={faTrash}/></button>
        </div>
        <div className="horizontal-card-info">
          <p className="horizontal-card-price">PKR {product.price}</p>
          <div className="horizontal-card-quantity">
            <button className="quantity-button" onClick={handleDecrement} disabled={isUpdating}>-</button>
              <span>{quantity}</span>
            <button className="quantity-button" onClick={handleIncrement} disabled={isUpdating}>+</button>
          </div>
        </div>
        {/* <p className="horizontal-card-size">Remaining {product.qty} {product.qty > 1 ? 'products' : 'product'}</p> */}
        <p className="horizontal-card-size">Size {product.size}</p>
      </div>
    </div>
  );
};

export default HorizontalCard;
