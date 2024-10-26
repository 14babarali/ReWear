import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../ProductCard';
// import { ToastContainer } from 'react-toastify';
import '../stylesheets/productcard.css';
import { useLocation, useParams } from 'react-router-dom';

const Products = () => {
  const [productList, setProductList] = useState([]);
    // const [selectedCategory, setSelectedCategory] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noProducts, setNoProducts] = useState(false);
  
    const location = useLocation();
    let { category } = useParams();
    const categoryId = location.state?.categoryId;
    const transformedCategory = category ? category.replace(/-/g, '/') : ''; // Replace hyphen with slash
  
    // Map for formatting categories
    const categoryMap = {
      mens: "Men's",
      womens: "Women's",
      childrens: "Children's"
    };
  
    // // Format the category to capitalize each segment and add apostrophes where necessary
    const formattedCategory = transformedCategory
      .split('/') // Split the category into segments by '/'
      .map(segment => {
        const lowerSegment = segment.toLowerCase();
        return categoryMap[lowerSegment] || segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
      })
      .join('/'); // Join them back together with a slash
  
    // console.log(formattedCategory);

    const fetchProductsForBuyer = async () => {
      // console.log('Category ID:', categoryId);
      try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3001/api/dynamic/${categoryId}`);
          // console.log('Response Data:', response.data);

          if (response.status === 200) {
              setProductList(response.data);
              setNoProducts(response.data.length === 0); // Update noProducts state based on response data length
          } else {
              console.error('Failed to fetch products');
          }
      } catch (error) {
          console.error('Error:', error); // Log the error
          setError(error.response?.data.message || 'An error occurred while fetching products'); // Use error message from response if available
      } finally {
          setLoading(false);
      }
  };
    
    useEffect(() => {
      fetchProductsForBuyer();
    }, [categoryId]); // Ensure it runs again if categoryId changes

  // const filteredProducts = productList.filter((product) => {
  //     if (selectedCategory.category) {
  //         return (
  //             product.subChildCategory === selectedCategory.category._id ||
  //             product.subcategory === selectedCategory.category._id ||
  //             product.category === selectedCategory.category._id
  //         );
  //     }
  //     return false;
  // });


  return (
    <>
    {/* <ToastContainer/> */}
      <div className="container vh-100 w-100" style={{ maxWidth: '100%' }}>
        <h3 className="text-center mt-4 mb-4">{`${formattedCategory}`}</h3>
        
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
                        <p className="text-center mt-4 mb-4">No products match your selection.</p>
                    )}
            </div>
      </div>
    </>
  );
}

export default Products;
