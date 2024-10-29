import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './order.css'; // Custom styles
import noImg from '../../assests/error-404.png';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/orders', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error('Error fetching orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return (
        <div className="orders-container">
            <h2 className="orders-heading">Your Orders</h2>
            {orders.length === 0 ? (
                <p className="no-orders-text">No orders found.</p>
            ) : (
                <div className="orders-grid">
                    {orders.map((order) => {
                        const customOrderId = order._id.slice(-8); // Compute customOrderId

                        return (
                            <div key={order._id} className="order-card">
                                <h3 className="order-id">Order ID: {customOrderId}</h3>
                                <p className="order-status">Status: <span className={`status ${order.status}`}>{order.status}</span></p>
                                
                                <div className="order-products">
                                {order.products.map((item, index) => (
                                    <div key={`${order._id}-${item.product_id?._id || index}`} className="product-item">
                                        <div className='d-flex' style={{gap:'10px'}}>
                                            <img 
                                                src={`http://localhost:3001/uploads/${item.productImage}`} 
                                                alt={item.product_id?.name} 
                                                style={{width:'120px', height:'120px', objectFit:'cover'}}
                                            />
                                            <div>
                                                <p className="product-name">{item.product_id?.name ? item.product_id?.name : 'Product No Longer Available'}</p>
                                                <p className="product-quantity">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="order-type">Payment Method: {order.type}</p>
                                        <p className="product-price">Price: Rs{item.price}</p>
                                        <p className="order-total">Total Price: Rs{order.total_price.toFixed(2)}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
