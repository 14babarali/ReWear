import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProduct.css'; // Import your external CSS file
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const AdminProduct = () => {
  // State to store the product list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
  });


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const response = await axios.get('http://localhost:3001/api/featured_products', config); 
        setProducts(response.data); // Set the fetched products to state

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
      finally{
        setLoading(false);
      }
    };

    fetchProducts(); // Call the function to fetch products
  }, [navigate]);


  // Filter products based on selected criteria
  const filteredProducts = products.filter(product => {
    return (
      (filters.type ? product.type === filters.type : true) &&
      (filters.minPrice ? product.price >= filters.minPrice : true) &&
      (filters.maxPrice ? product.price <= filters.maxPrice : true)
    );
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setIsFilterOpen(false);
  };

  const removeFilters = () => {
    setFilters({
      type: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="admin-product-list">
      <h1 className="admin-product-title">Products</h1>

      {/* Filter Button */}
      <div className='d-flex mb-2' style={{gap:'10px', justifyContent: 'end'}}>
      <FontAwesomeIcon icon={faFilter}  style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setIsFilterOpen(true)} />
        <p>|</p>
      <a onClick={removeFilters} style={{color: '#333', textDecoration: 'underlined', cursor: 'pointer'}}>
        Remove Filters
      </a>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="filter-modal">
          <div className="filter-content">
            <div className='d-flex' style={{ justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Filter Products</h2>
            <span onClick={() => setIsFilterOpen(false)} style={{cursor: 'pointer'}}>
              X
            </span>
            </div>
            {/* Filter by Type */}
            <label>Type:</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>            

            {/* Filter by Price */}
            <label>Min Price:</label>
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} />

            <label>Max Price:</label>
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} />

            {/* Apply Filters Button */}
            <button onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-product-loading">Loading products...</div>
      ) : (
        <div className="admin-product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="admin-product-card p-1">
              {/* Image */}
              
              <img
                src={`http://localhost:3001/uploads/${product.images[0]}` ? `http://localhost:3001/uploads/${product.images[0]}` : 'https://via.placeholder.com/150'}
                alt={product.name}
                className="admin-product-image"
              />
              

              {/* Product Info */}
              <div className="admin-product-info">
                <h2 className="admin-product-name">{product.name}</h2>
                {/* <p className="admin-product-catalog">
                  Catalog: {product.catalogName}
                </p> */}
                <p className="admin-product-type">Type: {product.type}</p>

                <p className="admin-product-condition admin-product-new">
                  Condition: {product.condition}
                </p>

                <p className="admin-product-quantity">
                  Quantity: {product.qty}
                </p>
                {/* <p className="admin-product-description">
                  {product.description}
                </p> */}
                <p className="admin-product-price">
                  Price: Rs.{product.price.toFixed(2)}
                </p>
                <p className="admin-product-size">Size: {product.size}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
