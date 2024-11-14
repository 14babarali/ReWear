import React from "react";
import { useNavigate, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Measure from "./Giff/Measure.mp4";

function MeasurementChoice() {
  const navigate = useNavigate();

  const handleSystemMeasurement = () => {
    navigate("/buyer/Measurement");
  };

  const handleOwnMeasurement = () => {
    navigate("/buyer/DataMeasurement");
  };

  return (
    <div className="flex flex-col h-[600px] mt-0 mb-4 items-center justify-center bg-gray-100  p-8">
      <h1 className="text-2xl mt-2 text-center font-semibold mb-2">
        Choose Your Measurement Option
      </h1>
      <p className="mb-2 text-gray-700">
        Would you like to use the system measurement or enter your own
        measurements?
      </p>
      <div className="flex mb-2 space-x-4 justify-center">
        <button
          onClick={handleSystemMeasurement}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Use System Measurement
        </button>
        <button
          onClick={handleOwnMeasurement}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Enter Own Measurement
        </button>
      </div>

      {/* Upper Section: Text and Video */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 mb-0 w-full max-w-4xl">
        {/* Left section: Text */}
        <div className="w-full md:w-1/2 text-left p-8">
          <h2 className="text-3xl font-bold mb-4">Measurements Made Easy</h2>
          <p className="text-red-700 text-2xl mb-4">
            Take Measurements at Home, As Accurate as a Tailor
          </p>
          <p className="text-gray-600 mb-6">
            In under 30 seconds, our system measures 10 different points for
            clothes that are as accurate as a professional tailor.
          </p>
        </div>

        {/* Right section: Video */}
        <div className="w-full md:w-1/2">
          <ReactPlayer
            url={Measure}
            controls
            playing={true}
            loop={true}
            muted={true}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}

export default MeasurementChoice;
