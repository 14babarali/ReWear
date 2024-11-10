import React from 'react';
import { Link } from 'react-router-dom';
import './stylesheets/suggesstedproduct.css';
// import main1 from '../assests/main-1.png';

const SuggestedProductCard = ({ product }) => {
  return (
    <Link 
            className="text w-full" 
            to={`/buyer/productpage/${product._id}`} 
            state={{product}}>  
    <div className="suggested-product-card w-full d-flex align-items-center gap-2">
                 
      <img 
        src={`http://localhost:3001/uploads/${product.images[0]}`} 
        alt={product.name} 
        className="suggestedproduct-image img-fluid rounded" />
      <div className="product-details ms-3">
        <h5 className="product-name">{product.name}</h5>
        {product.type === 'New' ? '':<p className="product-condition"> Condition: {product.condition}/10 </p>}
        <p className= "product-type">Type: {product.type ? 'New' : 'Used'}</p>
      </div>
      <div className="product-price ms-auto">
        <p>PKR {product.price}</p>
      </div>
    </div>
    </Link>
  );
};

export default SuggestedProductCard;
