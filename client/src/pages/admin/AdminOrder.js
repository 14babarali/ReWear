import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faCheckCircle, faExclamationCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const AdminOrder = () => {
  // State to store all fetched orders and filtered orders
  const [allOrders, setAllOrders] = useState([]); // Store all orders fetched from the backend
  const [filteredOrders, setFilteredOrders] = useState([]); // Store filtered orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState('');

  // Filter states
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  // Function to fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/admin/orders/all', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        setAllOrders(response.data.data); // Store fetched orders in allOrders
        setFilteredOrders(response.data.data); // Initially set filteredOrders to all orders
      } else {
        setError('No orders found.');
      }
    } catch (err) {
      setError('Error fetching orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter the fetched orders based on the selected filters
  useEffect(() => {
    let filtered = allOrders;

    // Apply order status filter
    if (orderStatus) {
      filtered = filtered.filter(order => order.status === orderStatus);
    }

    // Apply payment method filter
    if (paymentMethod) {
      filtered = filtered.filter(order => order.type === paymentMethod);
    }

    // Apply sort order
    if (sortOrder === 'latest') {
      filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOrder === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredOrders(filtered); // Update filtered orders based on the criteria
  }, [orderStatus, paymentMethod, sortOrder, allOrders]);

  const openModal = (order, type) => {
    setSelectedOrder(order);
    setModalType(type); // Set modal type (buyer/seller)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <span> Active <FontAwesomeIcon icon={faCheckCircle} className="status-icon active" /> </span>;
      case 'restricted': return <span> Restricted <FontAwesomeIcon icon={faExclamationCircle} className="status-icon restricted" /></span>;
      case 'banned': return <span> Banned <FontAwesomeIcon icon={faTimesCircle} className="status-icon banned" /></span>;
      default: return null;
    }
  };


  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-10">All Orders</h1>

      {/* Filter Controls */}
      <div className="mb-6 flex justify-end items-center" style={{gap:'10px'}}>
        <div>
          <label className="mr-2">Order Status:</label>
          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="Card">Card Payments</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Sort By:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Show loading state */}
      {loading ? (
        <div className="text-center text-gray-500">
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        // Display error message if there's an error
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        // Display message if no orders are fetched
        <div className="text-center text-gray-500">
          <p>No orders to display</p>
        </div>
      ) : (
        // Display filtered orders
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-lg rounded-lg p-6 transform hover:scale-105 transition-transform duration-300"
            >
              {order.products.map((product, index) => (
                <div key={index}>
                  <div className="mb-4">
                    <div className='d-flex' style={{gap:'10px'}}>
                      <p className="text-gray-500 mb-0">Order ID: #{order._id.slice(-8)}</p>
                      <span
                        className={`${
                          order.status === 'Delivered'
                            ? 'text-green-500'
                            : order.status === 'Canceled'
                            ? 'text-red-500'
                            : 'text-yellow-500'
                        } font-semibold`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className='d-flex' style={{gap: '5px'}}>
                      <img 
                        src={`http://localhost:3001/uploads/${product.product_id.images[0]}`}
                        alt={product.product_id.name} 
                        style={{width:'120px', height:'120px', objectFit:'cover'}}
                      />
                      <div>
                        <h2 className="text-xl font-semibold m-0">{product.product_id.name}</h2>
                        <span className='text-gray-600 m-0'>QTY: {product.quantity ? product.quantity: 'n/a'}</span>
                        <div>
                          <span className='text-gray-600'>Payment Method: </span>
                          <span>{order.type}</span>
                        </div>
                        <div className=" justify-between items-center">
                          <span className="text-gray-600">Amount:</span>
                          <span className="text-gray-900">Rs. {order.total_price}</span>
                        </div>
                        <div className=" justify-between items-center">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => openModal(order, 'Buyer')}
                    >
                      Buyer Details
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => openModal(order, 'Seller')}
                    >
                      Seller Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {/* Modal Component */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {modalType === 'buyer' ? 'Buyer Details' : 'Seller Details'}
            </h2>
          </div>

          {/* Order ID */}
          <h2 className="text-sm text-gray-600 mb-4">
            Order ID: #{selectedOrder ? selectedOrder._id.slice(-8) : ''}
          </h2>

          {/* Conditional Rendering of Buyer/Seller Details */}
          {modalType === 'Buyer' ? (
            <>              
              <img 
                src={`http://localhost:3001/uploads/${selectedOrder?.buyer_id?.profile?.profilePicture}`} 
                alt={selectedOrder?.buyer_id?.profile?.name} 
                className="w-36 h-36 rounded-full object-cover mb-4" 
              />
              <p><strong>Name:</strong> {selectedOrder?.buyer_id?.profile?.name}</p>
              <p><strong>Email:</strong> {selectedOrder?.buyer_id?.email}</p>
              <p><strong>Phone:</strong> {selectedOrder?.phone}</p>
              <p><strong>Address:</strong> 
                {selectedOrder?.address?.street}, {selectedOrder?.address?.city}, {selectedOrder?.address?.postalcode}
              </p>
            </>
          ) : (
            <div className='justify-content-center'>
              <img 
                src={`http://localhost:3001/uploads/${selectedOrder?.products[0]?.product_id?.userId?.profile?.profilePicture}`} 
                alt={selectedOrder?.products[0]?.product_id?.userId?.profile?.name} 
                className="w-36 h-36 rounded-full object-cover mb-4" 
              />
              <div className='d-flex align-middle mb-2' style={{gap:'10px', alignItems: 'center'}}>
              <p className='font-semibold m-0'>{selectedOrder?.products[0]?.product_id?.userId?.profile?.name} </p>
              <p className='text-ms m-0'>({selectedOrder?.products[0]?.product_id?.userId?.role})</p>
              {selectedOrder?.products[0]?.product_id?.userId.isVerified ? (
              <span style={{ 
                color: 'green', 
                backgroundColor: '#d4edda', // Light green background
                padding: '5px',
                fontSize: '10pt',
                borderRadius: '5px',
                marginLeft: '10px'
              }}>
                Verified
              </span>
              ) : (
                <span style={{ 
                  color: 'red', 
                  backgroundColor: '#f8d7da', // Light red background
                  padding: '5px 10px',
                  fontSize: '10pt',
                  borderRadius: '5px',
                  marginLeft: '10px'
                }}>
                  Unverified
                </span>
              )}
                <p className='text-ms m-0'>{getStatusIcon(selectedOrder?.products[0]?.product_id?.userId?.status)}</p>
                <span className='d-flex' style={{gap:'5px',border: '1px solid black', padding: '5px', borderRadius: '4px', alignItems: 'center', cursor: 'pointer'}}>
                  <p className='text-xs m-0'>Chat</p>
                  <FontAwesomeIcon icon={faCommentAlt} />
                </span>
              </div>
              <p><strong>Email:</strong> {selectedOrder?.products[0]?.product_id?.userId?.email}</p>
              <p><strong>Phone:</strong> {selectedOrder?.products[0]?.product_id?.userId?.profile?.phone}</p>
              <p><strong>Address:</strong> 
                {selectedOrder?.products[0]?.product_id?.userId?.profile?.addresses?.[0]?.street}, 
                {selectedOrder?.products[0]?.product_id?.userId?.profile?.addresses?.[0]?.city}, 
                {selectedOrder?.products[0]?.product_id?.userId?.profile?.addresses?.[0]?.postalcode}
              </p>
            </div>
          )}

          {/* Close Button */}
          <button 
            onClick={closeModal} 
            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrder;
