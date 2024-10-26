import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TailorOrders.css';

const TailorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', price: '', date: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Wrap fetchOrders with useCallback to prevent re-declaration on every render
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/fetchorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched orders:", response.data); // Log the response data
      setOrders(response.data);
      setFilteredOrders(response.data);

    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.message 
        ? err.response.data.message 
        : err.message;
      setError(errorMessage);
    }
  }, [token]); // Add token as a dependency since it's used in the function

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Include fetchOrders as a dependency

  // Wrap applyFilters with useCallback to prevent re-declaration on every render
  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Status Filter
    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    // Date Filter
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

    // Price Filter
    if (filters.price === 'low-to-high') {
      filtered.sort((a, b) => a.total_price - b.total_price);
    } else if (filters.price === 'high-to-low') {
      filtered.sort((a, b) => b.total_price - a.total_price);
    }

    // Search Filter
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
  }, [orders, filters, searchTerm]); // Include dependencies

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Include applyFilters as a dependency

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
    <div className="orders-page">
      <h1 className="text-center">Manage Orders</h1>

      <div className="filters">
        <select name="date" onChange={handleFilterChange} value={filters.date}>
          <option value="">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <select name="price" onChange={handleFilterChange} value={filters.price}>
          <option value="">Price Filter</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>

        <select name="status" onChange={handleFilterChange} value={filters.status}>
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
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Info</th>
            <th>Products Info</th>
            <th>Order Type</th>
            <th>Total Price</th>
            <th>Address</th>
            <th>Status</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>
              <span
                onClick={() => {
                  navigator.clipboard.writeText(order._id);
                  alert('Order ID copied to clipboard!');
                }}
                style={{ cursor: 'pointer' }}
              >
                {order._id.length > 10 ? `${order._id.slice(0, 10)}...` : order._id}
              </span>
              </td>
              <td><h3>{order.buyerName}</h3><p>{order.buyer_id.email}</p><p>{order.phone}</p></td>
              <td>
                <ul>
                  {order.products.map((product) => (
                    <li key={product._id}>
                      <strong>{product.product_id.name}</strong> <br />
                      Price: {product.product_id.price} <br />
                      QTY: {product.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.type}</td>
              <td>{order.total_price}</td>
              <td>{/* Displaying the address */}
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.postalcode}</p></td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TailorOrders;
