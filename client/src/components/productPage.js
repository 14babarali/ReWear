import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import StarRating from './starcomponent';
import SuggestedProductCard from './suggestedproduct';
import ReviewForm from './ReviewForm'; // Import the ReviewForm component
import UserDetails from './UserDetails'; // Import Seller Profile component
import Productinfo from './Productinfo'; 
import { Modal } from 'react-bootstrap'; // Bootstrap Modal
import Error404 from '../assests/error-404.png';
import './stylesheets/productpage.css'; // CSS file imported
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const ProductPage = () => {
  const location = useLocation();
  const { dispatch } = useContext(CartContext);

  const { id } = useParams();
  const { product } = location.state || {};
  const [isWishlisted, setIsWishlisted] = useState(product.wishlist);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); // For storing reviews
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false); // State for modal visibility

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
  }, [id]);

  useEffect(() => {
    // Fetch reviews for the current product
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/reviews/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Placeholder for loading state if needed
  }

  const { name, price, condition, images, size, type, material, category, description } = product;

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

  // Open and close modal handlers
  const handleShowModal = () => setShowReviewModal(true);
  const handleCloseModal = () => setShowReviewModal(false);

  // Filter out the current product from suggested products and match the category
  const suggestedProducts = products.filter(p => p._id !== product._id && p.category === category);

  return (
      <div className="product-page-container mb-10">
        <div className="product-content">
          {/* Left Section for Product Image */}
          <div className="product-image-section">
            <img
              src={`http://localhost:3001/uploads/${images[currentImageIndex]}`}
              alt={name}
              className="product-image"
            />
            <div className="image-thumbnails">
              {images.map((_, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/uploads/${images[index]}`} // Assuming URLs
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>

          
            <Productinfo  des={description}/>
          </div>

          {/* Right Section for Product Details */}
          <div className="product-details-section">
            <h1 className="product-title">
              {name}
            </h1>
            
            {/* Display the product price */}
            <p className="product-price">Price: PKR {price}</p>
            <ul className="list-unstyled product-specs">
              <li><strong>Size: </strong> {size}</li>
              <li><strong>Material: </strong> {material}</li>
              <li><strong>Type: </strong> {type ? type : 'None'}</li>
              <li><strong>Condition: </strong> <StarRating condition={condition} /> ({condition}/10)</li>
            </ul>

            {/* Product Action Buttons */}
            <div className="product-action-buttons d-flex align-items-center mt-4">
              <button className="btn add-to-bag-btn" onClick={addToCart}>
                <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
              </button>
              <button className="btn wishlist-btn" onClick={handleAddToWishlist}>
                {isWishlisted ? (
                  <FontAwesomeIcon icon={faHeart} />
                ) : (
                  <FontAwesomeIcon icon={faHeartRegular} />
                )}
              </button>
            </div>

            {/* Button to open Review Form Modal */}
            <button className="btn leave-review-btn mt-3" onClick={handleShowModal}>
              Leave a Review
            </button>

            {/* Modal for Review Form */}
            <Modal 
              show={showReviewModal} 
              onHide={handleCloseModal} 
              centered 
              // Prevent closing on outside click
              keyboard={false}   // Prevent closing on pressing "Escape"
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ marginBottom: '20px' }}>Leave a Review</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ReviewForm productId={id} />
              </Modal.Body>
            </Modal>

            {/*seller profile details */} 
            <UserDetails />  

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
            {/* Customer Reviews */}
            {/* <h4 className="mt-4">Customer Reviews</h4>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="review">
                  <strong>Rating:</strong> {review.rating}/5 <br />
                  <strong>Comment:</strong> {review.comment || 'No comment'} <br />
                  <strong>Reviewed by:</strong> {review.reviewer_id.username}
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )} */}
          </div>
        </div>

      <ToastContainer />
      </div>
  );
};

export default ProductPage;
