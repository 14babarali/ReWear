import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loaderAnimation from './Giff/loader.json'; // Import your JSON animation file
import './DeliverParcel.css'; // Import the CSS for styling

const DeliverParcel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Track if the button is permanently disabled

  const handleSendClothes = () => {
    setIsLoading(true);
    setIsButtonDisabled(true); // Disable the button permanently after click

    // Simulate a delay for sending clothes (you can replace it with an actual API call)
    setTimeout(() => {
      setIsLoading(false); // Stop the loader after the simulation or API call
      alert('Your clothes have been sent!'); // You can show a confirmation message here
    }, 3000); // Simulate 3-second loading time
  };

  return (
    <div className="buyer-delivery-page-super-dooper-complex">
      <h2>Deliver Your Clothes</h2>
      <p>Please deliver your fabric or clothes to the following address:</p>
      <p><strong>Tailor Address:</strong> 123 Tailor Street, Clothing Town, CT 12345</p>

      <button
        className="send-button-super-dooper-complex"
        onClick={handleSendClothes}
        disabled={isButtonDisabled} // Disable button after first click
      >
        {isLoading ? 'Sending...' : 'Send Clothes'} {/* Change button text when loading */}
      </button>

      {/* Loader with Blurred Background */}
      {isLoading && (
        <div className="loader-overlay-super-dooper-complex">
          <div className="loader-container-super-dooper-complex">
            <Player
              autoplay
              loop
              src={loaderAnimation} // Use the Lottie JSON animation
              style={{ height: '150px', width: '150px' }}
            />
            <p>Your request is being processed. Please wait...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverParcel;
