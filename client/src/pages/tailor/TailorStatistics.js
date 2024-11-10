import React from 'react';
import './TailorStatistics.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TailorStatistics = () => {
  // Sale statistics data
  const saleData = {
    labels: ['May 31', 'Jun 30', 'Jul 31', 'Aug 31', 'Sep 30', 'Oct 31'],
    datasets: [
      {
        label: 'Sales Count',
        data: [300, 450, 350, 400, 300, 18],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const saleOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { display: true },
      y: { display: true, beginAtZero: true },
    },
  };

  // Example data for recent orders
  const orders = [
    {
      id: 1,
      username: 'Imran',
      product: 'Nmd_r1 shoes',
      image: 'https://via.placeholder.com/50', // Placeholder image
      price: 'Rs. 3000',
    },
    {
      id: 2,
      username: 'Rafay',
      product: 'Alphaedge 4d reflective shoes R',
      image: 'https://via.placeholder.com/50', // Placeholder image
      price: 'Rs. 2000',
    },
    {
      id: 3,
      username: 'Zubair',
      product: 'Edge gameday shoes',
      image: 'https://via.placeholder.com/50', // Placeholder image
      price: 'Rs. 2500',
    },
    {
      id: 4,
      username: 'Amna',
      product: 'Alphaedge 4d reflective shoes R',
      image: 'https://via.placeholder.com/50', // Placeholder image
      price: 'Rs. 5000',
    },
    {
      id: 5,
      username: 'Dua',
      product: 'Alphaedge 4d reflective shoes R',
      image: 'https://via.placeholder.com/50', // Placeholder image
      price: 'Rs. 1330',
    },
  ];

  return (
    <div className="seller-statistics">
      <div className="statistics-container">
        <div className="sale-statistics">
          <h2>Sale Statistics</h2>
          <Line data={saleData} options={saleOptions} />
        </div>
        <div className="lifetime-sales">
          <h2>Lifetime Sales</h2>
          <div className="lifetime-info">
            <p>10 orders</p>
            <p>Rs 250000 lifetime sale</p>
            <p>95% of orders completed</p>
            <p>5% of orders cancelled</p>
          </div>
          <div className="lifetime-chart">
            <div className="circle-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="100, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-item" key={order.id}>
              <div className="order-image">
                <img src={order.image} alt={order.product} />
              </div>
              <div className="order-details">
                <h4>{order.username}</h4>
                <p>{order.product}</p>
              </div>
              <div className="order-price">
                <p>{order.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TailorStatistics;
