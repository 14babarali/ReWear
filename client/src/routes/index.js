import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img1 from '../assests/1.png';
import img2 from '../assests/2.png';
import img3 from '../assests/3.png';
import img4 from '../assests/4.png';
import img5 from '../assests/5.png';
import Feature1 from '../assests/Feature1.png';
import Feature2 from '../assests/Feature2.png';
import Feature3 from '../assests/Feature3.png';
import Measure from './stylesheet/Measure.mp4';
import clothing from '../assests/casual_clothing.jpg';
import tailormade from '../assests/tailor_made.png';
import eventdresses from '../assests/event_dresses.png';
import shoes from '../assests/shoes_wear.png';
import ProductCard from '../components/ProductCard';
import ReactPlayer from "react-player";
import './stylesheet/index.css';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

function Home() {
  const images = [img1, img2, img3, img4];
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  // Fetch products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get('http://localhost:3001/api/featured_products', config); 
        setProducts(response.data);
        console.log(products);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Clear any stored token (optional)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirect to logout or login page
          navigate('/logout');
        } else {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchProducts();
  },[navigate]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  const productsPerPage = 5;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  // console.log(currentProducts);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="px-4 lg:px-8">
      <ToastContainer />
      
      {/* Hero Section */}
      <div 
        className="text-center py-5 mx-auto bg-cover bg-center rounded-lg"
        style={{ 
          backgroundImage: `url(${images[currentIndex]})`, 
          height: '500px', 
          width: '100%', 
          marginTop: '5px' 
        }}
      >
        {/* Optional content in hero */}
      </div>

      {/* Major Categories */}
      <div className="bg-maroon text-center py-2 rounded-lg mt-3" >
        {/* <h2 className="text-white text-2xl">Major Categories</h2> */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center text-white py-3">
          <div className="flex flex-col items-center">
            <Link to="/buyer/product/event-dresses" className="flex flex-col items-center text-white no-underline">
              <img
                src={eventdresses}
                alt="Event Dresses"
                className="w-20 h-30 object-cover rounded-full mb-2"
              />
              <p className="mt-2" style={{ textDecoration: 'none' }}>Formal</p>
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link to="/buyer/product/tailor-made" className="flex flex-col items-center text-white no-underline">
              <img
                src={tailormade}
                alt="Tailor Made"
                className="w-20 h-30 object-cover rounded-full mb-2"
              />
              <p className="mt-2">Tailor Made</p>
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link to="/buyer/product/casual-clothing" className="flex flex-col items-center text-white no-underline">
              <img
                src={clothing}
                alt="Casual Clothing"
                className="w-20 h-20 object-cover rounded-full mb-2"
              />
              <p className="mt-2 no-underline">Casual</p>
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link to="/buyer/product/shoes" className="flex flex-col items-center text-white no-underline">
              <img
                src={shoes}
                alt="Shoes"
                className="w-20 h-30 object-cover rounded-full mb-2"
              />
              <p className="mt-2">Shoes</p>
            </Link>
          </div>
        </div>
      </div>

        
{/* Tailor image */}
<div className="text-center py-5 mx-auto bg-cover bg-center rounded-lg">
  <div className="relative">
  
    <img 
      src={img5} 
      alt="Tailor Order" 
      className="w-100 h-auto object-cover"
    />

  </div>
</div>
<div className="bg-maroon text-white py-12">
      <div className="flex flex-col md:flex-row justify-around items-center text-center px-4">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center mb-6 md:mb-0">
       
          <img src={Feature1} alt="Custom Designed Clothes" className="feature_img w-16 h-16 mb-4" />
          <h3 className="feature_text text-lg font-semibold">Custom Designed Clothes</h3>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center mb-6 md:mb-0">
      
          <img src={Feature2} alt="Custom Measurements" className="feature_img w-16 h-16 mb-4 color-light" />
          <h3 className="feature_text text-lg font-semibold">Custom Measurements Via Phone Scan</h3>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
      
          <img src={Feature3} alt="Perfect Fit Guarantee" className="feature_img w-16 h-16 mb-4" />
          <h3 className="feature_text text-lg font-semibold">Perfect Fit Guarantee (With Free Refunds)</h3>
        </div>

      </div>
    </div>

<div className="flex flex-col md:flex-row items-center justify-center bg-white p-8">
      {/* Left section: Text */}
      <div className="w-full md:w-1/2 text-left p-8">
        <h2 className="text-3xl font-bold mb-4">Measurements Easy As ABC</h2>
        <p className="text-red-700 text-2xl mb-4">Take Measurement At home, As accurate as Tailor</p>
        <p className="text-gray-600 mb-6">
          In under 30 seconds our System measure 10 different points for clothes that are as accurate than a professional tailor.
        </p>
        <Link 
  to="/buyer/measurement" 
  className="bg-[#333] text-white px-6 py-3 rounded-lg hover:bg-[#1a1a1a] no-underline text-sm mt-8"
>
  Order Now 
</Link>

      </div>

      {/* Right section: Video */}
      <div className="w-full md:w-1/2">
        <ReactPlayer 
          url={Measure} // Update this with your video path
          controls 
          playing={true} 
          loop={true} 
          muted={true} 
          width="100%"
          height="100%"
        />
      </div>
    </div>

      {/* Featured Products */}
      <div className="my-8">
        <h2 className="text-center text-2xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentProducts.length === 0 ? (
            <div className="col-span-full text-center">
              <p>No products to show</p>
            </div>
          ) : (
            currentProducts.map(product => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <nav className="mt-6">
            <ul className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    className={`px-4 py-2 rounded-lg ${index + 1 === currentPage ? 'bg-dark text-white' : 'bg-light text-black border'}`}
                    onClick={() => handlePageClick(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default Home;

// apply this validation on OrderNow button

// import { Link, useNavigate } from "react-router-dom";
// import React from "react";

// const OrderNowButton = () => {
//   const navigate = useNavigate();

//   // Assuming user data is stored in localStorage
//   const user = JSON.parse(localStorage.getItem("user")) || {}; // Fallback to an empty object if no user is found
//   const isLoggedIn = !!localStorage.getItem("token"); // Check if the user is logged in
//   const userRole = user.role; // Get the user's role

//   const handleValidation = (e) => {
//     if (!isLoggedIn) {
//       e.preventDefault();
//       alert("You need to log in to place an order.");
//       navigate("/login"); // Redirect to login page
//     } else if (userRole !== "buyer") {
//       e.preventDefault();
//       alert("Only buyers are allowed to place orders.");
//     }
//   };

//   return (
//     <Link
//       to="/buyer/measurement"
//       className="absolute bottom-4 right-20 bg-[#333] text-white px-3 py-1 rounded-lg hover:bg-[#1a1a1a] no-underline text-sm"
//       style={{ marginRight: '30px' }}
//       onClick={handleValidation} // Apply validation on click
//     >
//       Order Now
//     </Link>
//   );
// };

// export default OrderNowButton;
