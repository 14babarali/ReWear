import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const CategoryLinks = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/products/${category}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setProducts(response.data);
          // console.log(response.data);
        } else {
          toast.warning('Nothing to Display');
          console.error('Failed to fetch products');
  
        }
      } catch (error) {
        toast.warning(`${error}`);
        console.error('Error:', error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="container mb-4">
      <h3 className='text-center mt-4 mb-4'>{`${category}`}</h3>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {products.map((product) => (
          <div key={product._id} className="col">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center mt-4">
          <p>No products available in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryLinks;