import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import './TailorWork.css'; // Add your enhanced CSS styling here
import deliveryAnimation from './Giff/delivery.json'; // Import the JSON animation

const TailorWork = () => {
  const location = useLocation();
  const buyerDetails = location.state?.buyerDetails; // Get buyer details from location state

  // Target date for the countdown
  const targetDate = new Date('2024-12-31T00:00:00'); // Replace with your target date

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isOrderCompleted, setIsOrderCompleted] = useState(false); // Track if order is completed
  const [isDelivering, setIsDelivering] = useState(false); // Track if delivering animation is being shown
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // To show confirmation modal

  useEffect(() => {
    let timer;
    if (!isOrderCompleted) {
      timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOrderCompleted]);

  const handleOrderCompleted = () => {
    setIsOrderCompleted(true); // Mark the order as completed and stop the timer
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const handleDeliverOrder = () => {
    setIsDelivering(true); // Show the delivery animation
    setTimeout(() => {
      setIsDelivering(false); // Hide the animation after a few seconds
      alert('Order has been delivered!'); // You can replace this with any API call or confirmation
    }, 3000); // Simulate 3-second delivery time
  };

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }
    return (
      <span key={interval}>
        {timeLeft[interval]} {interval}{' '}
      </span>
    );
  });

  return (
    <div className="countdown-page">
      <h2>Order Countdown</h2>
      <div className={`countdown-timer ${isOrderCompleted ? 'stopped' : ''}`}>
        {timerComponents.length ? (
          <span>
            {timeLeft.days} <span className="time-label">days</span> {timeLeft.minutes} <span className="time-label">minutes</span>
          </span>
        ) : (
          <span>Time's up!</span>
        )}
      </div>

      <div className="buyer-details">
        <h3>Delivery Information</h3>
        <p><strong>Name:</strong> {buyerDetails?.name || 'N/A'}</p>
        <p><strong>Phone:</strong> {buyerDetails?.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {buyerDetails?.address || 'N/A'}</p>
        <p><strong>Product:</strong> {buyerDetails?.product || 'N/A'}</p>
      </div>

      <div className="action-buttons">
        <button
          className={`complete-button ${isOrderCompleted ? 'completed' : ''}`}
          onClick={handleOrderCompleted}
        >
          {isOrderCompleted ? 'Order Completed' : 'Mark Order as Completed'}
        </button>
        
        <button
          className="deliver-button"
          onClick={handleDeliverOrder}
          disabled={!isOrderCompleted} // Disable until order is completed
        >
          Deliver Order
        </button>
      </div>

      {/* Delivery Animation with Blurred Background */}
      {isDelivering && (
        <div className="delivery-overlay">
          <div className="delivery-container">
            <Player
              autoplay
              loop
              src={deliveryAnimation} // Use the imported Lottie JSON animation
              style={{ height: '150px', width: '150px' }}
            />
            <p>Delivering the order, please wait...</p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Completed</h3>
            <p>The buyer is notified that you have completed the order. Please give them a call before delivering.</p>
            <button className="close-button" onClick={() => setShowConfirmationModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorWork;
