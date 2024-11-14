import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img1 from '../assests/1.png';
import img2 from '../assests/2.png';
import img3 from '../assests/3.png';
import img4 from '../assests/4.png';
import img5 from '../assests/5.png';
import Feature1 from '../assests/Feature1.png';
import Feature2 from '../assests/Feature2.png';
import Feature3 from '../assests/Feature3.png';
import clothing from '../assests/casual_clothing.jpg';
import tailormade from '../assests/tailor_made.png';
import eventdresses from '../assests/event_dresses.png';
import shoes from '../assests/shoes_wear.png';
import ProductCard from '../components/ProductCard';
import { ToastContainer } from 'react-toastify';

function Home() {
  const images = [img1, img2, img3, img4, img5];
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  // Fetch products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get('http://localhost:3001/api/featured_products', config);
        setProducts(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/logout');
        } else {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchProducts();
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const productsPerPage = 20;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-4 lg:px-8 bg-gray-50">
      <ToastContainer />

      {/* Hero Section */}
      <div
        className="flex mt-2 items-center justify-center h-[560px] object-contain bg-cover bg-center rounded-lg mb-8 text-white"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <div className="bg-black bg-opacity-50 p-5 rounded-lg text-center">
          <h1 className="text-4xl font-semibold mb-2">Explore Our Exclusive Collection</h1>
          <p className="text-lg mb-4">Find the perfect style for every occasion</p>
          <Link
            to="/buyer/products"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Major Categories */}
      <div className="bg-maroon rounded-lg p-6 text-center mb-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[{ src: eventdresses, label: 'Formal', link: '/buyer/product/event-dresses' },
          { src: tailormade, label: 'Tailor Made', link: '/buyer/product/tailor-made' },
          { src: clothing, label: 'Casual', link: '/buyer/product/casual-clothing' },
          { src: shoes, label: 'Shoes', link: '/buyer/product/shoes' }].map((category) => (
            <Link
              to={category.link}
              key={category.label}
              className="flex flex-col items-center text-gray-800 transition-transform transform hover:scale-105"
            >
              <img
                src={category.src}
                alt={category.label}
                className="w-24 h-24 object-cover rounded-full mb-2 border-2 border-gray-200"
              />
              <p className="font-normal text-gray-200 underline">{category.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-gray-900 text-gray-800 rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">Why Choose Us?</h2>
        <div className="flex flex-col md:flex-row justify-around  rounded pt-2 text-center">
          {[{ src: Feature1, label: 'Custom Stitched Clothes' },
          { src: Feature2, label: 'Tailoring Services' },
          { src: Feature3, label: 'Wide Variety(New/Used)' }].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center bg-gray-900 mb-6 md:mb-0">
              <img src={feature.src} alt={feature.label} className="w-16 h-16 mb-2" />
              <p className="text-lg text-white font-normal">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="my-8">
        <h2 className="text-center text-2xl font-semibold mb-4 text-gray-800">ReWear Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentProducts.length === 0 ? (
            <div className="col-span-full text-center">
              <p className="text-gray-500">No products to show</p>
            </div>
          ) : (
            currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                } transition-colors hover:bg-indigo-500 hover:text-white`}
              >
                {index + 1}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export default Home;
