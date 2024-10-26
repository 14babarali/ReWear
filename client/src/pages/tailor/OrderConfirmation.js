
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleYes = () => {
    // Redirect to CountdownTimerPage with buyer details
    navigate('/tailor/Work', {
      state: {
        buyerDetails: {
          name: 'John Doe',
          phone: '+1234567890',
          address: '123 Tailor Street, Clothing Town, CT 12345',
          product: 'Custom Suit',
        },
      },
    });
  };

  const handleNo = () => {
    setShowModal(true); // Show modal when the tailor clicks "No"
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  return (
    <div className="tailor-confirmation-page">
      <h2>Fabric Delivery Confirmation</h2>
      <p>Have you received the fabric from the buyer?</p>

      <div className="response-buttons">
        <button className="yes-button" onClick={handleYes}>Yes</button>
        <button className="no-button" onClick={handleNo}>No</button>
      </div>

      {/* Modal for reporting the issue when No is selected */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Report Issue</h3>
            <p>It seems you haven't received the fabric. Would you like to report this issue to the buyer?</p>
            <div className="modal-buttons">
              <button className="report-button">Report Issue</button>
              <button className="close-button" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
