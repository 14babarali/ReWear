import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import Stiching from "./Giff/StichReq.json"; // Replace with the correct path to your Lottie animation file

function RequestView() {
  const location = useLocation();
  const request = location.state?.request || {}; // Ensure request exists
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: Stiching,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-sm mt-1">Review your measurements and style before submission</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          {/* Fitting Style */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fitting Style</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner text-gray-700">
              <p>
                <span className="font-semibold">Style:</span> {request?.fitType || "Not specified"}
              </p>
            </div>
          </div>

          {/* Measurements */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Measurements</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner text-gray-700 space-y-2">
              {request.measurements?.shirt && (
                <>
                  <h3 className="text-xl font-semibold">Shirt Measurements</h3>
                  {Object.entries(request.measurements.shirt.takensize || {}).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}:</span> {value || "N/A"} inches
                    </p>
                  ))}
                </>
              )}
              {request.measurements?.trouser && (
                <>
                  <h3 className="text-xl font-semibold">Trouser Measurements</h3>
                  {Object.entries(request.measurements.trouser.takensize || {}).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key.replace(/([A-Z])/g, " $1")}:</span> {value || "N/A"} inches
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner text-gray-700">
              <p>{request?.description || "No description provided"}</p>
            </div>
          </div>

          {/* Uploaded Design */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Uploaded Design</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner text-gray-700">
              {request.picture ? (
                <img
                  src={`http://localhost:3001/uploads/${request.picture}`}
                  alt="Uploaded Design"
                  className="w-full h-auto rounded-md"
                />
              ) : (
                <p>No design uploaded</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
          <p className="text-sm">Please review all information carefully before submitting.</p>
        </div>
      </div>

      {/* Modal for Success Animation */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center max-w-md mx-auto">
            <Lottie options={defaultOptions} height={150} width={150} />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Your request has been submitted!</h2>
            <p className="text-gray-600 mt-2">Thank you for your submission. We will process your request shortly.</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestView;
