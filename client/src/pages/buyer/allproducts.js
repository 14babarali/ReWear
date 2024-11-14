import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ProductCard from "../../components/ProductCard"; // Assuming you have a ProductCard component for displaying products

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    price: "",
    sortByDate: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get(
        "http://localhost:3001/api/featured_products",
        config
      ); // Adjust your API endpoint
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilters = () => {
    let sortedProducts = [...products];

    if (filters.price) {
      sortedProducts.sort((a, b) =>
        filters.price === "low-to-high" ? a.price - b.price : b.price - a.price
      );
    }

    if (filters.sortByDate) {
      sortedProducts.sort((a, b) =>
        filters.sortByDate === "latest"
          ? new Date(b.created_at) - new Date(a.created_at)
          : new Date(a.created_at) - new Date(b.created_at)
      );
    }

    setFilteredProducts(sortedProducts);
    setIsFilterOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        
        <h1 className="text-2xl text-center flex-grow font-semibold">All Products</h1>
        <button
          className="bg-gray-200 p-2 rounded-full shadow-md ml-auto"
          onClick={() => setIsFilterOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faFilter} className="text-gray-700" />
        </button>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 space-y-4">
          <div>
            <label className="font-medium">Price:</label>
            <select
              name="price"
              onChange={handleFilterChange}
              value={filters.price}
              className="border rounded px-2 py-1 ml-2"
            >
              <option value="">Select</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Date:</label>
            <select
              name="sortByDate"
              onChange={handleFilterChange}
              value={filters.sortByDate}
              className="border rounded px-2 py-1 ml-2"
            >
              <option value="">Select</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
