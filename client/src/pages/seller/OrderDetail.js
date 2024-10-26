import React, { useState } from 'react';

const OrderDetail = () => {
  // Static data for multiple orders
  const orders = [
    {
      orderNumber: 'INV123456789',
      date: '2024-09-01',
      total: 299.99,
      status: 'In Progress', // Possible values: 'Declined', 'In Progress', 'Delivered', 'Patched'
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '1234 Elm Street, Springfield, IL, 62701',
      },
    },
    {
      orderNumber: 'INV987654321',
      date: '2024-09-02',
      total: 149.99,
      status: 'Delivered',
      user: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        address: '4321 Oak Avenue, Metropolis, NY, 10001',
      },
    },
    {
      orderNumber: 'INV456789123',
      date: '2024-09-03',
      total: 199.99,
      status: 'Declined',
      user: {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '+1122334455',
        address: '5678 Pine Road, Gotham, CA, 90210',
      },
    },
  ];

  // State to manage the status change for each order
  const [orderStatuses, setOrderStatuses] = useState(
    orders.map((order) => order.status)
  );

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (index, newStatus) => {
    const updatedStatuses = [...orderStatuses];
    updatedStatuses[index] = newStatus;
    setOrderStatuses(updatedStatuses);
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsPopupVisible(true);
  };

  return (
    <>
    <div className="container mx-auto p-6 max-w-full bg-white shadow-lg rounded-md mt-3">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Orders Overview
      </h1>
      <div className="flex flex-row overflow-x-auto mb-5">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 p-4 m-2 bg-gray-100 rounded-lg shadow-md"
          >
            <p className="text-gray-600 font-semibold">Order Number:</p>
            <p className="text-gray-800 mb-2">{order.orderNumber}</p>

            <p className="text-gray-600 font-semibold">Date:</p>
            <p className="text-gray-800 mb-2">{order.date}</p>

            <p className="text-gray-600 font-semibold">Total:</p>
            <p className="text-gray-800 mb-2">${order.total}</p>

            <p className="text-gray-600 font-semibold mb-2">
              Status:
              <span
                className={`ml-2 font-bold ${
                  orderStatuses[index] === 'Declined'
                    ? 'text-red-500'
                    : orderStatuses[index] === 'Delivered'
                    ? 'text-green-500'
                    : orderStatuses[index] === 'Patched'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                }`}
              >
                {orderStatuses[index]}
              </span>
            </p>

            <select
              value={orderStatuses[index]}
              onChange={(e) => handleStatusChange(index, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full bg-white focus:outline-none focus:border-blue-500 mb-2"
            >
              <option value="Declined">Declined</option>
              <option value="In Progress">In Progress</option>
              <option value="Patched">Patched</option>
              <option value="Delivered">Delivered</option>
            </select>

            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
                Update Order
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => handleViewClick(order)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for order details */}
      {isPopupVisible && selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p><span className="font-semibold">Name:</span> {selectedOrder.user.name}</p>
            <p><span className="font-semibold">Email:</span> {selectedOrder.user.email}</p>
            <p><span className="font-semibold">Phone:</span> {selectedOrder.user.phone}</p>
            <p><span className="font-semibold">Address:</span> {selectedOrder.user.address}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => setIsPopupVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OrderDetail;
