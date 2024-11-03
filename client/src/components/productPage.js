import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import StarRating from './starcomponent';
import SuggestedProductCard from './suggestedproduct';
import UserDetails from './UserDetails'; // Import Seller Profile component
import Productinfo from './Productinfo'; 
import Error404 from '../assests/error-404.png';
import './stylesheets/productpage.css'; // CSS file imported
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import ReviewModal from './ReviewModal';

const ProductPage = () => {
  const location = useLocation();
  const { dispatch } = useContext(CartContext);

  const { product } = location.state || {};
  const {isWishlisted} = location.state || '';

  // State to track the selected size
  const [selectedSize, setSelectedSize] = useState('');

  const [isWishlistedState, setIsWishlisted] = useState(isWishlisted);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); // For storing reviews
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const handleShowReviewModal = () => {
    setShowReviewModal(true);
  };
  
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    console.log(size);
  };


  useEffect(() => {

    const checkWishlistStatus = async () => {

      try {

        const token = localStorage.getItem('token');

        if (!token) {

          console.info('No token found');

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


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/featured_products');
        setProducts(await response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [product]);

  
  useEffect(() => {
    fetchReviews();
  },[])

  // Fetch reviews for the current product
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/reviews/get/${product._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReviews(response.data);
      // console.log(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Placeholder for loading state if needed
  }
  const { name, price, condition,qty , images, size, type, material, category, description } = product;
  const originalPrice = price * 1.1;

  const handleAddToWishlist = async () => {
    try {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            toast.error('Please Login First.');
            return;
        }

        setIsWishlisted((previsWishlistedState) => !previsWishlistedState);

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
        } else if (response.status === 400 && response.data.message) {
            toast.error(response.data.message);
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

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };
  // Filter out the current product from suggested products and match the category
  const suggestedProducts = products.filter(p => p._id !== product._id && p.category === category);

  return (
      <div className="product-page-container mb-10">
        <div className="product-content">
          {/* Left Section for Product Image */}
            <div className="d-flex flex-column align-items-center product-image-section border-1">
            {/* Main Product Image */}
            <img
              src={`http://localhost:3001/uploads/${images[currentImageIndex]}`}
              alt={name}
              className="product-image mb-3" // Add margin to space it from the thumbnails
              onClick={() => openModal(images[currentImageIndex])}
            />

            {/* Image Thumbnails */}
            <div className="d-flex justify-content-center mb-3 image-thumbnails">
              {images.map((_, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/uploads/${images[index]}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''} mx-1`} // Add margin for spacing between thumbnails
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>

            {/* Product Info */}
            <div className='flex h-full w-full mb-30'>
            <Productinfo reviews={reviews} description={description} />

            </div>
          </div>

          {/* Right Section for Product Details */}
          <div className="product-details-section">
            <h1 className="product-title">
              {name}
            </h1>
            
            {/* Display the product price */}
            <div className="d-flex justify-start text-xl gap-2">
              <div className="product-original-price line-through text-gray-500">Rs: {originalPrice.toFixed(2)}</div>
              <div className="">Rs {price}</div>
            </div>
            <ul className="list-unstyled product-specs">
              <div className='d-flex ' style={{justifyContent: 'start', alignItems: 'center'}}>
              <li className='m-0'><strong>Size: </strong></li>
              <div className="size-blocks">
                {size.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeClick(s)}
                    className={`size-block ${selectedSize === s ? 'selected' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              </div>
              <li className='mt-2'><strong>Item left: </strong> {qty}</li>
              <li className='mt-2'><strong>Material: </strong> {material}</li>
              <li className='mt-2'><strong>Type: </strong> {type ? type : 'None'}</li>
              {type==='Used'? <li><strong>Condition: </strong> <StarRating condition={condition} /> ({condition}/10)</li>: null}
            </ul>

            {/* Product Action Buttons */}
            <div className="product-action-buttons d-flex align-items-center mt-4">
              <button className="btn add-to-bag-btn" onClick={addToCart}>
                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
              </button>
              <button className="btn wishlist-btn" onClick={handleAddToWishlist}>
                {isWishlistedState ? (
                  <FontAwesomeIcon icon={faHeart} />
                ) : (
                  <FontAwesomeIcon icon={faHeartRegular} />
                )}
              </button>
            </div>

            {/* Button to open Review Form Modal */}
            <button className="btn leave-review-btn mt-3" onClick={handleShowReviewModal}>
              Leave a Review
            </button>

            {showReviewModal && (
              <ReviewModal onClose={handleCloseReviewModal} productId={product._id} />
            )}

            {/*seller profile details */} 
            <UserDetails product={product} />

          {/* Suggested Products Section */}
          <div className="suggested-products-section">
            <h3>Suggested Products</h3>
              <div className="suggested-products d-flex flex-wrap">
                {suggestedProducts.length > 0 ? (
                  suggestedProducts.map((suggestedProduct) => (
                    <SuggestedProductCard key={suggestedProduct._id} product={suggestedProduct} />
                  ))
                ) : (
                  <p>
                    Sorry, Nothing to Suggest 
                    <img src={Error404} alt="error-404" style={{ width: '60px', height: '60px' }} />
                  </p>
                )}
                
              </div>
            </div>
          </div>
        </div>
      {/* Modal for displaying full-size image */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" onClick={closeModal}>
          <div className="d-flex relative w-[60%] justify-center">
            <img src={`http://localhost:3001/uploads/${selectedImage}`} alt="Review image" className="w-3/6 h-3/6 rounded-md" />
            <button onClick={closeModal} className="absolute bg-transparent top-4 right-4 text-white text-xl font-bold">✕</button>
          </div>
        </div>
      )}
      <ToastContainer />
      </div>
  );
};

export default ProductPage;
