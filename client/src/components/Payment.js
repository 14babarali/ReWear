import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckoutModal from './CheckoutModal';
import './stylesheets/Payment.css';
import Mastercard from './stylesheets/MasterCard.jpg';
import Visa from './stylesheets/VISA.png';
import UnionPay from './stylesheets/UnionPay.png';
import PayPak from './stylesheets/PayPak.png';

let stripePromise;

const initStripe = async () => {
  try {
    stripePromise = await loadStripe('pk_test_51Q9WsgRxZvryBcMfYznrpqU3TBLKi5kK424swAZQCzQRUqiusJKAqHZ0HVZ8eBF0kOs2E3OIzTsCMx9ycwjiGWJn00T29kelZh');
  } catch (error) {
    console.error("Error loading Stripe:", error);
    alert("Failed to initialize payment system. Please refresh the page or try again later.");
  }
};

initStripe();

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, orderData } = location.state || {};
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log(orderData);
      try {
        const response = await axios.post('http://localhost:3001/api/orderplace', orderData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          setIsModalOpen(true);
          navigate('/buyer');
        } else {
          alert('Failed to place order. Please try again.');
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Server error. Please try again later.');
      }
    }

    setLoading(false);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="payment-container">
      <form onSubmit={handleSubmit} className="payment-form">
        <CheckoutModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <h2>Pay with card</h2>
        <div className="payment-method-icons">
          <img src={Visa} alt="Visa" />
          <img src={Mastercard} alt="Mastercard" />
          <img src={UnionPay} alt="UnionPay" />
          <img src={PayPak} alt="PayPak" />
        </div>

        <input type="text" placeholder="Full Name" className="payment-input" style={{ width: '100%' }} />
        <CardElement className="payment-input" />

        {error && <div className="payment-error">{error}</div>}
        <button type="submit" disabled={!stripe || loading} className="pay-now-btn">
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        <button type="button" className="go-back-btn-super-complex-xyzab" onClick={handleGoBack}>
          Go Back
        </button>
      </form>
    </div>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Payment;
