import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart, faDollar } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import StarRating from './starcomponent';
import SuggestedProductCard from './suggestedproduct';
import UserDetails from './UserDetails'; // Import Seller Profile component
import Productinfo from './Productinfo'; 
import Error404 from '../assests/error-404.png';
import './stylesheets/productpage.css'; // CSS file imported
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import ReviewModal from './ReviewModal';

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useContext(CartContext);

  const { product } = location.state || {};
  const {isWishlisted} = location.state || '';
  const [isLoading, setIsLoading] = useState(false);

  // State to track the selected size
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQty, setSelectedQty] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [isWishlistedState, setIsWishlisted] = useState(isWishlisted);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]); // For storing reviews
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // const [reviewed, setReviewed] = useState(false);

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

  useEffect(() => {
    if (selectedQty && (selectedQty < quantity)) {
      setQuantity(selectedQty); // Ensure selected quantity does not exceed available stock
    }
  }, [selectedQty]);

  const handleSizeClick = (size, qty) => {
    setSelectedSize(size);
    setSelectedQty(qty); // Set the quantity based on selected size
  };

  const handleIncrement = () => {
    if(!selectedQty){
      toast.warning('Please Select Size First',{
        autoClose: 1500,
      });
    }
    if (quantity < selectedQty) {
      setQuantity(prevQty => prevQty + 1);
    }
  };

  const handleDecrement = () => {
    if(!selectedQty){
      toast.warning('Please Select Size First',{
        autoClose: 1500,
      });
    }
    if (quantity > 1 && selectedSize) {
      setQuantity(prevQty => prevQty - 1);
    }
  };

  useEffect(() => {
    checkWishlistStatus();
    // fetchOrdersStatus();
    fetchProducts();
    fetchReviews();
  }, [product]);

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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/featured_products');
      setProducts(await response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

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

  // const fetchOrdersStatus = async () => {
  //   const productId = product._id;
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.get(`http://localhost:3001/api/review_order_status/${productId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     if(response.status === 200)
  //     {
  //       setReviewed(true);
  //       alert(response.st.atus);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching reviews:', error.response?.data?.message || 'Unknown error');
  //     alert(error.response?.data?.message || 'An error occurred');
  //     setReviewed(false);
  //   }
  // }

  if (!product) {
    return <div>Loading Product...</div>; // Placeholder for loading state if needed
  }
  const { name, price, condition ,sizes, images, type, material, category, description } = product;
  const originalPrice = price * 1.1;

  const buyNow = () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      toast.warning('Please log in to proceed', { autoClose: 1500 });
      return;
    }
  
    if (!selectedSize) {
      toast.warning('Please select a size', { autoClose: 1500 });
      return;
    }
  
    // Navigate to checkout page with product data, selected size, and quantity as state
    navigate('/buyer/checkout', {
      state: {
        product,
        selectedSize,
        quantity,
      },
    });
  };  


  const handleAddToWishlist = async () => {
    setIsLoading(true);
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
          setTimeout(() => {
            setIsLoading(false); // Reset loading state after 2 seconds
          }, 2000);
          const message = isWishlisted ? 'Product added to wishlist!' : 'Product removed from wishlist!';
          if(isWishlisted){
            toast.success(message, 1500);
          }
          else{
            toast.warning(message,1500);
          }
          

        }
    
      } catch (error) {
    
        toast.error('Error toggling wishlist: ', error.message);
        console.error('Error toggling wishlist:', error);
    
      }finally{
        setIsLoading(false)
      }
  };
  
  const addToCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add products in cart.', {
              autoClose: 1500,});
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
      <div className="product-page-container mb-10 gap-1">
        <ToastContainer/>
        <div className="product-content flex flex-col lg:flex-row gap-8">
          {/* Left Section for Product Image */}
          <div className="product-image-section mt-0 p-4 border border-gray-200 rounded-md">

            {/* Main Product Image */}
            <img
              src={`http://localhost:3001/uploads/${images[currentImageIndex]}`}
              alt={name}
              className="product-image mb-3" // Add margin to space it from the thumbnails
              onClick={() => openModal(images[currentImageIndex])}
            />

            {/* Image Thumbnails */}
            <div className="d-flex justify-content-center w-full border-b-2 mb-2 image-thumbnails">
              {images.map((_, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001/uploads/${images[index]}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail mt-3 mb-3 cursor-pointer ${index === currentImageIndex ? 'border border-teal-500' : ''}`}
                  onClick={() => handleDotClick(index)}
                />
              ))}
            </div>
            
            <div className="flex flex-col">
              <Productinfo reviews={reviews} description={description} />
            </div>

            
          </div>

          {/* Right Section for Product Details */}
          <div className="product-details-section bg-white lg:w-1/2 p-4 lg:p-8 border border-gray-200 rounded-md">
          <h1 className="product-title text-2xl font-bold mb-4">{name}</h1>
          <div className="flex gap-2 text-xl mb-4">
            <span className="line-through text-gray-500">Rs: {originalPrice.toFixed(2)}</span>
            <span>Rs {price}</span>
          </div>
          <ul className="product-specs list-unstyled mb-4 space-y-2">
            <li><strong>Material:</strong> {material}</li>
            <li><strong>Type:</strong> {type || 'None'}</li>
            {type === 'Used' && (
              <li><strong>Condition:</strong> <StarRating condition={condition} /> ({condition}/10)</li>
            )}
          </ul>

          {product?.sizes?.reduce((total, item) => total + item.qty, 0) > 0 ? (
            <>
              {/* Quantity Selector */}
              <div className="quantity-selector">
                <div className="flex items-center justify-center border-1 p-2 rounded-32 w-2/4 gap-4">
                  <button onClick={handleDecrement} className="text-xl px-3 py-2 bg-gray-600 hover:bg-gray-400 rounded-full">-</button>
                  <span>{quantity}</span>
                  <button onClick={handleIncrement} className="text-xl px-3 py-2 bg-gray-600 hover:bg-gray-400 rounded-full">+</button>
                </div>
              </div>

              {/* Size Selection */}
              {sizes.length !== 0 && (
                <div className="size-selection mt-3">
                  <h4>Available Sizes:</h4>
                  <div className="size-options flex flex-wrap gap-2 mt-2">
                    {sizes.map((sizeObj, index) => (
                      <button
                        key={index}
                        className={`size-button w-12 p-2 rounded ${selectedSize === sizeObj.size ? 'bg-teal-500 text-white' : 'bg-gray-200 hover:bg-gray-400 text-gray-700'}`}
                        onClick={() => handleSizeClick(sizeObj.size, sizeObj.qty)}
                      >
                        {sizeObj.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Info */}
              <div className="selected-quantity mt-2">
                {selectedQty ? `Items left: ${selectedQty}` : `Items left: ${sizes?.reduce((total, item) => total + item.qty, 0)}`}
              </div>

              {/* Action Buttons */}
              <div className="product-action-buttons d-flex gap-2 mt-6">
                <button className="add-to-bag-btn w-36 text-white px-4 py-2 rounded-md"
                  onClick={buyNow}>
                  <FontAwesomeIcon icon={faDollar}/> Buy Now
                </button>
                <button className="bg-teal-500 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
                  onClick={addToCart}>
                  {!isLoading ? <FontAwesomeIcon icon={faShoppingCart} /> : 'loading'}
                </button>
                <button className="wishlist-btn text-red-500" onClick={handleAddToWishlist}>
                  <FontAwesomeIcon icon={isWishlistedState ? faHeart : faHeartRegular} />
                </button>
              </div>

            </>
          ) : (
            <p className="text-red-500">Out of Stock</p>
          )}
              
          {/* Review Button */}
          {/* {reviewed === true? */}
            <button className="leave-review-btn mt-4 bg-gray-300 p-2 rounded" onClick={handleShowReviewModal}>
              Leave a Review
            </button>
           {/* :
            <></>
          } */}
          {showReviewModal && <ReviewModal onClose={()=>handleCloseReviewModal} productId={product._id} />}
          <div className="seller-details mt-6">
            <UserDetails product={product} />
          </div>
         {/* Suggested Products Section */}
         <div className="suggested-products-section p-2 w-full  m-0 mt-2">
            <h3 className='text-xs '>Similar Products</h3>
              <div className="suggested-products d-flex flex-wrap">
                {suggestedProducts.length > 0 ? (
                  suggestedProducts.map((suggestedProduct) => (
                    <SuggestedProductCard key={suggestedProduct._id} product={suggestedProduct} />
                  ))
                ) : (
                  <p style={{display:'flex',justifyContent: 'center' ,alignItems:'center'}}>
                    No Similar Products Found 
                    <img src={Error404} alt="error-404" style={{ width: '60px', height: '60px' }} />
                  </p>
                )}
                
              </div>
            </div>
          </div>
        </div>
      {isModalOpen && (
        <div className="modal fixed h-4/6 w-4/6 inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <img src={`http://localhost:3001/uploads/${selectedImage}`} alt="Modal Image" className="rounded-md" />
          <button className="close-modal absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>✕</button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
