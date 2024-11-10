import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import Navbar from './AdminNav.js';  Import the Navbar component
// import Sidebar from './AdminSidebar.js'; // Import the Sidebar component
import './AdminDashboard.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/admin/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setOrders(response.data.data); // Accessing orders from response.data.data
      }
    } catch (error) {
      console.error('Error fetching orders:', error); // Log the error for debugging
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Dummy data for charts
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Bridal Dress', 'Casual Dressing', 'Man shirt'],
    datasets: [
      {
        data: [55, 25, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-100">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-500">RS 450,000</p>
              <span className="text-sm text-green-500">+45% this week</span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-500">RS 920,000</p>
              <span className="text-sm text-green-500">+60% this week</span>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-500">2,560</p>
              <span className="text-sm text-green-500">+20% this week</span>
            </div>
          </div>

          {/* Recent Orders and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
              {loading ? (
                <p className="text-center text-gray-500">Loading orders...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found.</p>
              ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Order ID</th>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Amount</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                  {orders.map((order) => (
                      order.products.map((product, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">#{order._id.slice(-8)}</td>
                          <td className="px-4 py-2">{product.product_id?.name || 'Product Name Unavailable'}</td>
                          <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-2">Rs. {product.price * product.quantity}</td>
                          <td className="px-4 py-2 text-green-500">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                        </tr>
                      ))
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
              <Pie data={pieData} />
            </div>
          </div>

          {/* Charts and Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>
              <Bar data={barData} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Delivery Progress</h3>
              <ul>
                <li className="mb-2">
                  <span className="font-semibold">Men Clothing</span> 60%
                </li>
                <li className="mb-2">
                  <span className="font-semibold">Women Clothing</span> 40%
                </li>
                <li className="mb-2">
                  <span className="font-semibold">Children Clothing</span> 20%
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
