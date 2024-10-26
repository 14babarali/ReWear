import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProduct.css'; // Import your external CSS file
import axios from 'axios';

const AdminProduct = () => {
  // State to store the product list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className="admin-product-list">
      <h1 className="admin-product-title">Products</h1>

      {loading ? (
        <div className="admin-product-loading">Loading products...</div>
      ) : (
        <div className="admin-product-grid">
          {products.map((product) => (
            <div key={product.id} className="admin-product-card">
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
