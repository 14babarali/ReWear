import React from 'react';
import { Link } from 'react-router-dom';
import './stylesheets/suggesstedproduct.css';
// import main1 from '../assests/main-1.png';

const SuggestedProductCard = ({ product }) => {
  return (
    <div className="suggested-product-card d-flex align-items-center m-2">
      <img 
        src={`http://localhost:3001/uploads/products/${product.images[0]}`} 
        alt={product.name} 
        className="suggestedproduct-image img-fluid rounded" />
      <div className="product-details ms-3">
        <h5 className="product-name">
          <Link 
            className="text" 
            to={`/productpage/${product._id}`} 
            state={{product}}> 
            {product.name}
          </Link>
        </h5>
        <p className="product-condition">Condition: {product.condition}/10</p>
        <p className= "product-type">Type: {product.isNew ? 'New' : 'Used'}</p>
      </div>
      <div className="product-price ms-auto">
        <p>PKR {product.price}</p>
      </div>
    </div>
  );
};

export default SuggestedProductCard;
