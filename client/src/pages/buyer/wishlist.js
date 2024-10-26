import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard'; 
import '../../components/stylesheets/productcard.css';
import './wishlist.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);

    if (!token) {
      alert('please login to add products into wishlist.');
      return;
    }
    try {
    const response = await axios.get('http://localhost:3001/api/wishlist-items', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = await response.data;
        setWishlist(data);
        setLoading(false);
      }
      else if (response.status === 404){
        toast.warning(`${response.statusText}`);
        setLoading(false);
      }

      
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to fetch wishlist. Please try again later.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchWishlist();
  },[]);

  return (
    <div className="wishlist-page vh-100">
      <ToastContainer />
      <h1 className="mb-4" style={{textAlign:"center"}}>Wishlist</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && wishlist.length === 0 && (
        <p style={{textAlign:'center', marginTop:'200px'}}>Your wishlist is empty. <Link to="/">Start shopping!</Link></p>
      )}
      {!loading && !error && wishlist.length > 0 && (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="col mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;