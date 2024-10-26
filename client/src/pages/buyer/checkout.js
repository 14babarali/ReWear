import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './checkout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import CheckoutModal from '../../components/CheckoutModal'; // Import the modal component

import axios from 'axios';

const Checkout = () => {
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        
        fetchProductDetails();

    },[]);

    // Function to fetch product details by IDs
    const fetchProductDetails = async () => {

        const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Parsing JSON to get the object

    if (user) {
        setIsLoggedIn(true);
        setUser(user);
    }

    if (token) {
        setIsLoggedIn(true);
    }


        try {
            const products = localStorage.getItem('selectedProducts');
            if (products) {
                setSelectedItems(JSON.parse(products));
            } else {
                setSelectedItems([]);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            // Handle error
        }
    };

    const calculateSubtotal = () => {
        const subtotal = selectedItems.reduce((subtotal, item) => {
            // console.log('Item:', item); // Logging item to see its structure
            const itemPrice = item.product.price;
            const itemQuantity = item.quantity;
            // console.log('Item Price:', itemPrice, 'Item Quantity:', itemQuantity);
            return subtotal + (itemPrice * itemQuantity);
        }, 0);
        // console.log('Subtotal:', subtotal);
        return subtotal;
    };
    
    const calculateTotal = () => {
        const total = calculateSubtotal(); // Assuming no discount or additional charges
        // console.log('Total:', total);
        return total;
    };


    // const handleOrderPlacement = async () => {
    //     if (!isLoggedIn) {
    //       toast.warning('Please log in to proceed with the payment.');
    //       navigate('/login');
    //       return;
    //     }
    //     if (!selectedAddress) {
    //       toast.warning('Please select an address to proceed with the payment.');
    //       return;
    //     }
    
    //     try {
    //       const orderData = {
    //         userId: user._id,
    //         items: selectedItems,
    //         address: selectedAddress,
    //         paymentMethod,
    //         totalAmount: calculateTotal() + 150, // Adding delivery charge
    //       };
    
    //       // POST request to place the order
    //       await axios.post('http://localhost:3001/api/orders', orderData, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         },
    //       });
    
    //       // Show confirmation message
    //       toast.success('Your Order has been placed, please wait for confirmation.');
    //       // Redirect or handle further actions if necessary
    //       navigate('/order-confirmation'); // Adjust as needed
    //     } catch (error) {
    //       console.error('Error placing order:', error);
    //       toast.error('Failed to place order. Please try again.');
    //     }
    //   };

    const handlePayment = async() => {
        if (!isLoggedIn) {
            toast.warning('Please log in to proceed with the payment.');
            navigate('/login');
            return;
        }
        if (!selectedAddress) {
            toast.warning('Please select an address to proceed with the payment.');
            return;
        }

        const products = selectedItems.map(item => ({
            product_id: item.product._id,
            quantity: item.quantity,
        }));
    
        // Find the selected address from user profile addresses
            const selectedAddressDetails = user.profile.addresses.find(address => address._id === selectedAddress);

            const orderData = {
                buyer_id: user._id,
                products: products,
                type: paymentMethod === 'card' ? 'Card' : 'COD',
                address: {
                    street: selectedAddressDetails.street,
                    city: selectedAddressDetails.city,
                    postalcode: selectedAddressDetails.postalcode,
                },
                phone: user.profile.phone, // include the phone number
            };
            
        // Handling Card payments
        if (paymentMethod === 'CARD' ||paymentMethod === 'card') {
            // Process card payment with cardDetails
            try {
                // Create payment intent on the backend
                const { data } = await axios.post('http://localhost:3001/payment/card-payment', {
                    amount: calculateTotal(),  // totalAmount should be the price to be paid
                    currency: 'PKR'
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log({data});
                // Navigate to payment page with clientSecret
                navigate('/buyer/card-payment', { state: { clientSecret: data.clientSecret, orderData } });
            } catch (error) {
                console.error('Error creating payment intent:', error);
                toast.error('Server error. Please try again later.');
            }
        } 

        else if (paymentMethod === 'COD' || paymentMethod === 'cod'){

            try {
                const response = await axios.post('http://localhost:3001/api/orderplace', orderData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Include token for authenticated requests
                    }
                });

                if(response.status  === 200 || response.status ===201){

                    // Display success message
                    setIsModalOpen(true);
                }
                else{
                    // Display error message
                    toast.error('Failed to place order. Please try again.');
                    
                }
            } catch (error) {
                console.error('Error placing order:', error);
                toast.error('Server Errors. Please try again after some time.');
            }

        
        }
    };

    const handleAddressSelection = (addressId) => {
        setSelectedAddress(addressId);
    };

    return (
        <div className="checkout-container">
            <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ToastContainer/>
            <div className='checkout-head'><h1>Checking out</h1><FontAwesomeIcon icon={faCartShopping} className='checkout-head-logo'/></div>
            <div className="checkout-content">
                <div className="left-section">
                    
                        
                    {isLoggedIn ? (
                        <>
                        <div className="account-details">
                        <h2>Personal Info & Addresses</h2>
                        <div className='mt-4'>
                            <p><strong>Name:</strong> {user.profile.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone:</strong> {user.profile.phone}</p>
                            <p><strong>Addresses:</strong> (Select Address)
                            <ul  style={{listStyleType:'none', paddingLeft:0}}>
                            {(user.profile.addresses || []).map((address, index) => (
                                <li key={index} className='mt-3'>
                                <input
                                    type="radio"
                                    id={`address-${index}`}
                                    name="address"
                                    value={address._id} // Use a unique identifier if available
                                    checked={selectedAddress === address._id}
                                    onChange={() => handleAddressSelection(address._id)}
                                />              
                                &nbsp;
                                <label htmlFor={`address-${index}`}> 
                                    {address.street}, {address.city}, {address.postalcode}
                                </label>
                                </li>
                                ))}
                            </ul>
                            </p>
                        </div>
                        </div>
                        </>
                    ) : (
                        <>
                        <div className="account-details">
                        <h2>Account Details</h2>
                            <p>Already have an account? <a href="/login">Log in</a></p>
                            <input type="email" placeholder="Email address" />
                            <div className="checkbox">
                                <input type="checkbox" id="email-offers" />
                                <label htmlFor="email-offers">Email me about new products and offers</label>
                            </div>
                            </div>
                            <>
                            <div className="shipping-address">
                                <h2>Personal & Address Info</h2>
                                <input type="text" id='name' placeholder="Name" />
                                <ReactPhoneInput
                                    inputExtraProps={{
                                        name: 'phone',
                                        id: 'phone',
                                        className: 'form-control',
                                    }}
                                    country={'pk'}
                                    value={phoneNumber}
                                    onChange={(phone) => setPhoneNumber(phone)}
                                />
                                <input type="text" placeholder="Street" className="full-width" />
                                <div className="address-details">
                                    <input type="text" placeholder="City" />
                                    <input type="text" placeholder="Postal Code" />
                                </div>
                                <input type="text" placeholder="Landmark (Optional)" />
                                <input type="text" placeholder="Alternate Phone (Optional)" />
                            </div>
                            </>
                        </>
                    )}

                    <div className="payment-section">
                        <h2>Payment Method</h2>
                        <div className="payment-method">
                            <input
                                type="radio"
                                id="cod"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                            />
                            <label htmlFor="cod">&nbsp;Cash on Delivery (COD)</label>
                        </div>
                        <div className="payment-method">
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                            />
                            <label htmlFor="card">&nbsp;Credit/Debit Card</label>
                        </div>
                        <div className='order-process'>
                            <a href="/cart" className="return-link">{'< Return to cart'}</a>
                            <button 
                                className="continue-button" 
                                onClick={handlePayment}>
                                
                                {paymentMethod === 'cod' ? 'Checkout' : 'Continue to Payments'}

                            </button>
                        </div>
                    </div>
                </div>

                <div className="right-section">
                <div className="order-summary">
                <h2>Order Summary</h2>
                {selectedItems.map(item => (
                    <div key={item.product._id} className="order-item" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <img 
                        src={`http://localhost:3001/uploads/${item.product.images[0]}`} 
                        alt={item.product.images[0]} 
                        className="product-image" 
                        style={{ width: '150px', height: 'auto', borderRadius: '8px', marginRight: '20px' }} 
                    />
                    <div className="product-details" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <p style={{ color: '#666', fontSize: '12px', margin: '0 0 5px' }}>{item.product._id}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '5px 0', color: '#333' }}>{item.product.name}</p>
                        <p style={{ fontSize: '14px', margin: '5px 0', color: '#555' }}><strong>QTY:</strong> {item.quantity}</p>
                        <p style={{ fontSize: '14px', margin: '5px 0', color: '#555' }}><strong>Price:</strong> Rs {item.product.price}</p>
                    </div>
  
                                <hr/>
                            </div>
                        ))}
                        <div className="discount-code">
                            <input type="text" placeholder="Discount code" />
                            <button className="apply-button">Apply</button>
                        </div>
                        <div className="total">
                            <p>Subtotal: Rs {calculateSubtotal().toFixed(2)}</p>
                            <p>Delivery: Rs 200</p>
                            <p>Taxes: Rs 0</p>
                            <p>Discount: 0%</p>
                            <h3>Total: Rs {(calculateTotal()+200).toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="shipping-policy">
                    <h3>Shipping</h3>
                    <p>We ship all over the world. For that matter, we have partnered with major courier services such as DHL, FedEx, etc. Read more in <a href="/buyer/privacy-policy">shipping policy</a></p>
                </div>
                <div className="return-policy">
                    <h3>Return Policy</h3>
                    <p>Returns not applicable for this product. If a damaged product was delivered and you have video proof, you are applicable for a full refund. <a href="./routes/AboutUs">Contact us to avail refund</a></p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
