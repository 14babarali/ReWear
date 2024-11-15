import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import '../stylesheets/productcard.css';
import { useLocation, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noProducts, setNoProducts] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    price: '',
    sortBy: '',
  });

  const location = useLocation();
  let { category } = useParams();
  const categoryId = location.state?.categoryId;
  const transformedCategory = category ? category.replace(/-/g, '/') : '';

  const categoryMap = {
    mens: "Men's",
    womens: "Women's",
    childrens: "Children's",
  };

  const formattedCategory = transformedCategory
    .split('/')
    .map(segment => {
      const lowerSegment = segment.toLowerCase();
      return categoryMap[lowerSegment] || segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    })
    .join('-');

  const fetchProductsForBuyer = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/dynamic/${categoryId}`);

      if (response.status === 200) {
        let filteredData = response.data;

        // Apply price filters
        if (filters.price) {
          filteredData = filteredData.filter(product => {
            if (filters.price === 'low-to-high') {
              return filteredData.sort((a, b) => a.price - b.price);
            } else if (filters.price === 'high-to-low') {
              return filteredData.sort((a, b) => b.price - a.price);
            }
            return true;
          });
        }

        // Apply sort by date
        if (filters.sortBy) {
          filteredData = filteredData.sort((a, b) => {
            if (filters.sortBy === 'latest') {
              return new Date(b.created_at) - new Date(a.created_at);
            } else if (filters.sortBy === 'oldest') {
              return new Date(a.created_at) - new Date(b.created_at);
            }
            return 0;
          });
        }

        setProductList(filteredData);
        setNoProducts(filteredData.length === 0);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNoProducts('');
    fetchProductsForBuyer();
    setError('');
    setProductList([]);
  }, [categoryId, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <>
    <ToastContainer/>
      <div className="container vh-100 w-100" style={{ maxWidth: '100%' }}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-center flex-grow">{formattedCategory}</h1>
          <button
            className="bg-gray-200 p-2 rounded-full shadow-md ml-auto"
            onClick={() => setIsFilterOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faFilter} className="text-gray-700" />
          </button>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="bg-white shadow-lg rounded-md p-4 mb-4 w-full max-w-xs mx-auto">
            <h2 className="text-lg font-semibold mb-2">Filter Options</h2>
            <div className="flex flex-col gap-2">
              {/* Price Filter */}
              <select
                name="price"
                onChange={handleFilterChange}
                value={filters.price}
                className="border rounded px-2 py-1 text-gray-600"
              >
                <option value="">Price Filter</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
              </select>

              {/* Sort by Date */}
              <select
                name="sortBy"
                onChange={handleFilterChange}
                value={filters.sortBy}
                className="border rounded px-2 py-1 text-gray-600"
              >
                <option value="">Sort by</option>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        )}

        {/* <h3 className="text-center mt-1 mb-4">{`${formattedCategory}`}</h3> */}
        
        {loading && <p className="text-center mt-4 mb-4">Loading products...</p>}
        {error && <p style={{ margin: '10px', padding: '10px', marginBottom: '30px', color: 'rosybrown' }}>
          {error.message || 'An error occurred while fetching products'}
        </p>}
        {noProducts && <p className="text-center mt-4 mb-4">No products available for this category.</p>}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {productList.length > 0 ? (
            productList.map((product) => (
              <div key={product._id} className="col mb-4">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="d-flex justify-center text-center mt-4 mb-4">
              <span>No products match your selection</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
