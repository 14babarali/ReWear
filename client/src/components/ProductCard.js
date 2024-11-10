import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
// import StarRating from './starcomponent';
import { StarIcon } from '@heroicons/react/24/solid';

import './stylesheets/productcard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { dispatch } = useContext(CartContext);

  useEffect(() => {

    const checkWishlistStatus = async () => {

      try {

        const token = localStorage.getItem('token');

        if (!token) {

          console.info('User Not Logged In');

          return;

        }


        const response = await axios.get(`http://localhost:3001/api/wishlist/${product._id}`, {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        });

        if (response.status === 200) {

          setIsWishlisted(response.data.isWishlisted);

        } else {

          console.error('Failed to fetch wishlist status');

        }

      } catch (error) {

        console.error('Error fetching wishlist status:', error);

      }

    };


    checkWishlistStatus();

  }, [product]);

  const handleAddToWishlist = async () => {
    try {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            toast.error('Please Login First.');
            return;
        }

        setIsWishlisted((prevIsWishlisted) => !prevIsWishlisted);

        const response = await axios.post('http://localhost:3001/api/wishlist', {
            productId: product._id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200 || response.status === 201) {
          console.log(`${response.data}`);
          const isWishlisted = response.data.isWishlisted;
          setIsWishlisted(isWishlisted);
          const message = isWishlisted ? 'Product added to wishlist!' : 'Product removed from wishlist!';
          if(isWishlisted){
            toast.success(message);
          }
          else{
            toast.warning(message);
          }
          

        }
    
      } catch (error) {
    
        toast.error('Error toggling wishlist: ', error.message);
        console.error('Error toggling wishlist:', error);
    
      }
  };
  
  const addToCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add products in cart.');
            return;
        }

        const response = await axios.post(
            'http://localhost:3001/api/cart',
            { productId: product._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.cart) {
            dispatch({ type: 'SET_CART', payload: response.data.cart });
            toast.success('Product added to cart!');
            // alert('Product added to Cart');
        } else if (response.status === 400 && response.data.message) {
            toast.error(response.data.message);
            // console.log(response.data.message);
            
        } else {
            console.error('Cart information not available in response:', response.data);
            toast.error('Failed to update cart. Please try again later.');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        if (error.response && error.response.data) {
            toast.error('Error: ' + error.response.data.message);
        } else {
            toast.error('Error adding product to cart: ' + error.message);
        }
    }
};

  return (
    <div className="card h-100 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
      <div className="image-container" style={{ position: 'relative' }}>
        <div className="row row-cols-1 flex-grow row-cols-md-2 row-cols-lg-5 g-4">
          <div className="overflow-hidden rounded-lg" style={{ height: '250px', width: '100%' }}>
            <img
              src={
                product?.images && product?.images.length > 0
                  ? `http://localhost:3001/uploads/${product.images[0]}`
                  : 'https://via.placeholder.com/300'
              }
              alt={product?.name}
              className="card-img-top transition-transform duration-300 ease-in-out hover:scale-110"
              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
        <span className={`badge badge-condition ${product?.type === 'New' ? 'badge-new' : ''}`}>
            {product?.type ? product?.type : 'None'}
        </span>
        <button
          className="btn-sm add-to-cart-btn"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      </div>
      <div className="card-body d-flex flex-column">
          <h6 className="product-card-title text-truncate p-1" title={product?.name}>
            <Link className="text" to={`/buyer/productpage/${product?._id}`} state={{product, isWishlisted} }>{product?.name}</Link>
          </h6>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <p className="card-text text-muted mb-0">Rs {product?.price}</p>
          <FontAwesomeIcon 
            icon={ isWishlisted ? faHeart : faHeartRegular} 
            onClick={handleAddToWishlist} 
            style={{ color: isWishlisted ? 'red' : 'gray', cursor: 'pointer'}}
          />
        </div>
        {/* <div className="mb-2">
        <p className="card-text mb-0">Size: {product.sizes.map((size,index)=> {
          product.sizes.size.join(', ');
          })}</p>
        </div> */}
        <div className="mb-2">
        <p className="card-text mb-0">
            Item Remaining: {product?.sizes?.reduce((total, item) => total + item.qty, 0) || 'out of stock'}
        </p>
        </div>
        {/* {product.type === 'Used' && (
          <div className="mb-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-6 w-6 cursor-pointer ${index <= (product.condition/2) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ProductCard;