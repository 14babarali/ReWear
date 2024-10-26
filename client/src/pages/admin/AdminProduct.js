import React, { useState, useEffect } from 'react';
import './AdminProduct.css'; // Import your external CSS file

const AdminProduct = () => {
  // State to store the product list
  const [products, setProducts] = useState([]);

  // Simulate fetching product data
  useEffect(() => {
    const fetchedProducts = [
      {
        id: 1,
        catalogName: 'Events',
        productName: 'Bridal Dress',
        productType: 'Women',
        isNew: true,
        condition: null,
        quantity: 5,
        description: 'New Type bridal Dress.',
        price: 1500.00,
        size: '13 inches',
        image: 'https://via.placeholder.com/150', // Replace with actual image URL
      },
      {
        id: 2,
        catalogName: 'Formal',
        productName: 'Shoes',
        productType: 'Man',
        isNew: false,
        condition: 'Good',
        quantity: 3,
        description: 'Brand New Shoes',
        price: 700.00,
        size: '6.1 inches',
        image: 'https://via.placeholder.com/150', // Replace with actual image URL
      },
      {
        id: 3,
        catalogName: 'Froak',
        productName: 'Children Dress',
        productType: 'Children',
        isNew: true,
        condition: null,
        quantity: 2,
        description: 'Children Dressing.',
        price: 1200.00,
        size: '21 cubic feet',
        image: 'https://via.placeholder.com/150', // Replace with actual image URL
      },
    ];

    // Set products after a delay (simulate API call)
    setTimeout(() => {
      setProducts(fetchedProducts);
    }, 1000);
  }, []);

  return (
    <div className="admin-product-list">
      <h1 className="admin-product-title">Product Catalog</h1>

      {products.length === 0 ? (
        <div className="admin-product-loading">Loading products...</div>
      ) : (
        <div className="admin-product-grid">
          {products.map((product) => (
            <div key={product.id} className="admin-product-card">
              {/* Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.productName}
                  className="admin-product-image"
                />
              )}

              {/* Product Info */}
              <div className="admin-product-info">
                <h2 className="admin-product-name">{product.productName}</h2>
                <p className="admin-product-catalog">
                  Catalog: {product.catalogName}
                </p>
                <p className="admin-product-type">Type: {product.productType}</p>

                {product.isNew ? (
                  <p className="admin-product-condition admin-product-new">
                    Condition: New
                  </p>
                ) : (
                  <p className="admin-product-condition admin-product-used">
                    Condition: Used ({product.condition})
                  </p>
                )}

                <p className="admin-product-quantity">
                  Quantity: {product.quantity}
                </p>
                <p className="admin-product-description">
                  {product.description}
                </p>
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
