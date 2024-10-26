import React, { useState } from 'react';
import './TailorOrderView.css';
// import designImage from './path-to-design-image.jpg'; // Replace with actual image path

const TailorOrderView = () => {
  const [isRejecting, setIsRejecting] = useState(false); // State to handle the reject modal
  const [isAccepting, setIsAccepting] = useState(false); // State to handle the accept modal
  const [showConfirmation, setShowConfirmation] = useState(null); // State to handle confirmation modal

  // Show confirmation modal when "Accept" or "Reject" is clicked
  const handleActionClick = (action) => {
    setShowConfirmation(action);
  };

  const handleConfirmAction = () => {
    if (showConfirmation === 'accept') {
      setIsAccepting(true);
    } else if (showConfirmation === 'reject') {
      setIsRejecting(true);
    }
    setShowConfirmation(null); // Close the confirmation modal
  };

  const handleCloseModal = () => {
    setIsRejecting(false); // Close rejection modal
    setIsAccepting(false); // Close acceptance modal
  };

  const setMeasurements = () => ({
    neck: 39,
    shoulderWidth: 46,
    chestBust: 102,
    waist: 86,
    sleeveLength: 61,
    bicep: 33,
    wrist: 18,
    shirtLength: 76
  });

  const measurements = setMeasurements();

  return (
    <div className="buyer-order-page">
      <h2>Buyer Order Details</h2>

      <div className="buyer-details">
        <h3>Buyer Information</h3>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Phone:</strong> +1234567890</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
        <p><strong>Package:</strong> Premium</p>
      </div>

      <div className="measurements-details">
        <h3>Measurement Details</h3>
        <p><strong>Category:</strong> Male</p>
        <p><strong>Product Type:</strong> Shirt</p>
        <p><strong>Fit Type:</strong> Slim Fit</p>
        <p><strong>Arms:</strong> {measurements.sleeveLength} inches</p>
        <p><strong>Chest:</strong> {measurements.chestBust} inches</p>
        <p><strong>Belly:</strong> {measurements.waist} inches</p>
        <p><strong>Neck:</strong> {measurements.neck} inches</p>
        <p><strong>Back:</strong> {measurements.shoulderWidth} inches</p>
        <p><strong>Bicep:</strong> {measurements.bicep} inches</p>
        <p><strong>Wrist:</strong> {measurements.wrist} inches</p>
        <p><strong>Shirt Length:</strong> {measurements.shirtLength} inches</p>
      </div>

      {/* Static description and design image */}
      <div className="design-section">
        <h3>Order Description</h3>
        <p>
          Below is a static description of the design. The tailor will follow these specifications to create the final product.
          This includes the selected material, pattern, and style preferences provided by the buyer.
        </p>

        <h3>Order Design</h3>

        {/* <img src={designImage} alt="Design" className="design-image" /> */}
      </div>

      <div className="action-buttons">
        <button className="accept-button" onClick={() => handleActionClick('accept')}>Accept Request</button>
        <button className="delete-button" onClick={() => handleActionClick('reject')}>Reject Request</button>
      </div>

      {/* Modal for confirmation */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{showConfirmation === 'accept' ? 'Accept Order' : 'Reject Order'}</h3>
            <p>Are you sure you want to {showConfirmation === 'accept' ? 'accept' : 'reject'} this order?</p>
            <button onClick={handleConfirmAction}>Yes</button>
            <button onClick={() => setShowConfirmation(null)}>No</button>
          </div>
        </div>
      )}

      {/* Modal for rejection confirmation */}
      {isRejecting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Rejected</h3>
            <p>The buyer has been notified that their order has been rejected.</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for acceptance confirmation */}
      {isAccepting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Order Accepted</h3>
            <p>The buyer has been notified that their order has been accepted.</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorOrderView;
