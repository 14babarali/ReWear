import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import loader from "./Giff/loader.gif"; // Import the loader image

const GigPackage = ({ packages }) => {
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  
  const navigate = useNavigate(); // Initialize the navigate hook

  // Simulated loading handler, modify this if you're using an actual API call
  const handleContinue = () => {
    setIsLoading(true);

    // Simulate a delay for order confirmation
    setTimeout(() => {
      setOrderConfirmed(true);
    }, 2000); // Simulate 2-second loading time
  };

  // Function to handle navigation to home page
  const handleGoToHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="relative">
      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 font-semibold ${
            selectedPackage === "basic" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          } rounded`}
          onClick={() => setSelectedPackage("basic")}
        >
          Basic
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            selectedPackage === "premium" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          } rounded`}
          onClick={() => setSelectedPackage("premium")}
        >
          Premium
        </button>
      </div>

      {/* Conditional Rendering of Selected Package */}
      {selectedPackage === "basic" && (
        <div className="border p-4 rounded-lg shadow-md mb-6">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-lg">Basic</h3>
            <p className="text-gray-600">PKR {packages.basic.price}</p>
          </div>
          <p className="text-gray-500 mt-2">{packages.basic.description}</p>
          <ul className="text-sm text-gray-600 mt-2">
            {packages.basic.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>✔️</span>
                <p>{feature}</p>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white w-full py-2 rounded"
            onClick={handleContinue} // Handle order placement
          >
            Continue
          </button>
        </div>
      )}

      {selectedPackage === "premium" && (
        <div className="border p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-lg">Premium</h3>
            <p className="text-gray-600">PKR {packages.premium.price}</p>
          </div>
          <p className="text-gray-500 mt-2">{packages.premium.description}</p>
          <ul className="text-sm text-gray-600 mt-2">
            {packages.premium.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span>✔️</span>
                <p>{feature}</p>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 bg-blue-500 text-white w-full py-2 rounded"
            onClick={handleContinue} // Handle order placement
          >
            Continue
          </button>
        </div>
      )}

      {/* Loader with Blurred Background */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
          <div className="flex flex-col items-center justify-center">
            <img
              src={loader} // Use the imported loader image
              alt="Loading"
              className="w-20 h-20 mb-4"
            />
            <p className="text-white font-semibold text-lg mb-4">
              Your request is on its way. Your order will be accepted soon.
            </p>
            {/* Go to Home Button */}
            <button
              className="bg-white text-black px-4 py-2 rounded-lg font-semibold"
              onClick={handleGoToHome}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}

      {/* Display order confirmation message */}
      {orderConfirmed && !isLoading && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          Your request is on its way. Your order will be accepted shortly.
        </div>
      )}
    </div>
  );
};

export default GigPackage;
