import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', price: '', date: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/fetchorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : err.message;
      setError(errorMessage);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    const now = new Date();
    if (filters.date === 'week') {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      filtered = filtered.filter((order) => new Date(order.created_at) >= lastWeek);
    } else if (filters.date === 'month') {
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      filtered = filtered.filter((order) => new Date(order.created_at) >= lastMonth);
    } else if (filters.date === 'year') {
      const lastYear = new Date(now);
      lastYear.setFullYear(now.getFullYear() - 1);
      filtered = filtered.filter((order) => new Date(order.created_at) >= lastYear);
    }

    if (filters.price === 'low-to-high') {
      filtered.sort((a, b) => a.total_price - b.total_price);
    } else if (filters.price === 'high-to-low') {
      filtered.sort((a, b) => b.total_price - a.total_price);
    }

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      filtered = filtered.filter(
        (order) =>
          order._id.match(searchRegex) ||
          order.buyer_id.email.match(searchRegex) ||
          order.products.some((product) =>
            product.product_id.name.match(searchRegex)
          )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filters, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:3001/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders((prevFilteredOrders) =>
        prevFilteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert('Order status updated successfully.');
    } catch (error) {
      setError('Failed to update order status.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-extrabold text-gray-800 mb-8">Manage Orders</h1>

      <div className="flex gap-4 mb-6">
        <select
          name="date"
          onChange={handleFilterChange}
          value={filters.date}
          className="border rounded px-4 py-2 text-gray-600 shadow-md"
        >
          <option value="">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select
          name="price"
          onChange={handleFilterChange}
          value={filters.price}
          className="border rounded px-4 py-2 text-gray-600 shadow-md"
        >
          <option value="">Price Filter</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>

        <select
          name="status"
          onChange={handleFilterChange}
          value={filters.status}
          className="border rounded px-4 py-2 text-gray-600 shadow-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="text"
          placeholder="Search by Order ID, Product, or Customer"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded px-4 py-2 text-gray-600 shadow-md"
        />
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span
                onClick={() => {
                  navigator.clipboard.writeText(order._id.slice(-8));
                  alert('Order ID copied to clipboard!');
                }}
                className="text-blue-500 cursor-pointer text-lg font-semibold"
              >
                {order._id.slice(-8)}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="border rounded px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-100"
              >
                <option value="pending" className="text-yellow-500">Pending</option>
                <option value="confirmed" className="text-blue-500">Confirmed</option>
                <option value="shipped" className="text-indigo-600">Shipped</option>
                <option value="delivered" className="text-green-500">Delivered</option>
                <option value="cancelled" className="text-red-500">Cancelled</option>
              </select>
            </div>

            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-900">{order.buyer_id.profile.name}</p>
              <p className="text-sm text-gray-600">{order.buyer_id.email}</p>
              <p className="text-sm text-gray-600">{order.phone}</p>
            </div>

            <div className="mb-4">
              <ul>
                {order.products.map((product) => (
                  <li key={product._id} className="flex items-center mb-4">
                    <img
                      srcSet={`http://localhost:3001/uploads/${product.product_id.images[0]} 1x, http://localhost:3001/uploads/${product.product_id.images[0]} 2x`}
                      alt={product.product_id.name}
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{product.product_id.name}</p>
                      <p className="text-sm text-gray-600">Price: {product.price}</p>
                      <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600"><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.postalcode}</p>
              <p className="text-sm text-gray-600"><strong>Order Type:</strong> {order.type}</p>
              <p className="text-lg font-bold text-gray-800 mt-2"><strong>Total Price:</strong> Rs{order.total_price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
