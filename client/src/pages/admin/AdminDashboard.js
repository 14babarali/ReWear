import React, { useState, useEffect } from "react";
import axios from "axios";
//import Navbar from './AdminNav.js';  Import the Navbar component
// import Sidebar from './AdminSidebar.js'; // Import the Sidebar component
import "./AdminDashboard.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryData, setCategoryData] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/admin/orders/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.success) {
        setOrders(response.data.data); // Accessing orders from response.data.data
      }
    } catch (error) {
      console.error("Error fetching orders:", error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Calculate category data
    const categoryMap = {};
    
    orders.forEach((order) => {
      order.products.forEach((product) => {
        const categoryName = product.product_id?.category?.name || 'Uncategorized';
        categoryMap[categoryName] = (categoryMap[categoryName] || 0) + product.quantity;
      });
    });
  
    const categories = Object.entries(categoryMap).map(([label, value]) => ({
      label,
      value,
    }));
  
    setCategoryData(categories);
  }, [orders]);

  // Dummy data for charts
  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: categoryData.map((item) => item.label),
    datasets: [
      {
        data: categoryData.map((item) => item.value),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };
  

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-100">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Total Sales */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-500">
                RS{" "}
                {orders.reduce(
                  (total, order) =>
                    total +
                    order.products.reduce(
                      (productTotal, product) =>
                        productTotal + product.price * product.quantity,
                      0
                    ),
                  0
                ).toLocaleString('en-IN')}
              </p>
              <span className="text-sm text-green-500">Combined Price of all Order's</span>
            </div>

            {/* Total Revenue */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-500">
                RS{" "}
                {orders
                  .filter((order) => order.status === "delivered")
                  .reduce(
                    (total, order) =>
                      total +
                      order.products.reduce(
                        (productTotal, product) =>
                          productTotal + product.price * product.quantity,
                        0
                      ),
                    0
                  ).toLocaleString('en-IN')}
              </p>
              <span className="text-sm text-green-500">Completed Order's Revenue</span>
            </div>

            {/* Total Orders */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Completed Orders</h3>
              <p className="text-3xl font-bold text-blue-500">
              {orders.filter((order) => order.status === "delivered").length.toLocaleString('en-IN')}
              </p>
              <span className="text-sm text-green-500">Delivered</span>
            </div>

            {/* Pending Orders */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold">Ongoing Orders</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {orders.filter((order) => order.status !== "delivered").length.toLocaleString('en-IN')}
              </p>
              <span className="text-sm text-yellow-500">
                Pending, confirmed or shipped
              </span>
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
                      {orders.slice(-6).map((order) =>
                        order.products.map((product, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">
                              #{order._id.slice(-8)}
                            </td>
                            <td className="px-4 py-2">
                              {product.product_id?.name ||
                                "Product Name Unavailable"}
                            </td>
                            <td className="px-4 py-2">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2">
                              Rs. {product.price * product.quantity}
                            </td>
                            <td className="px-4 py-2 text-green-500">
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
              {categoryData.length > 0 ? (
                <Pie data={pieData} />
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
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
