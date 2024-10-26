import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const GigHead = ({ tailor }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open the modal
  const openModal = () => setIsModalOpen(true);

  // Close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <img
            className="w-20 h-20 rounded-full"
            src={tailor.avatar}
            alt={tailor.name}
          />
          <div>
            <h1 className="text-2xl font-bold">{tailor.name}</h1>
            <div className="text-gray-500">
              <p>{tailor.location}</p>
              <p>{tailor.languages}</p>
              <p>{tailor.ordersCompleted} orders completed</p>
            </div>
            <button
              onClick={openModal} // Trigger modal on button click
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Contact me
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500">
            <span className="font-bold">{tailor.rating}</span> ({tailor.reviews})
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p><strong>Name:</strong> {tailor.name}</p>
            <p><strong>Address:</strong> {tailor.location}</p>
            <p><strong>Contact Number:</strong> +1234567890</p> {/* You can replace with actual contact number */}
            <p><strong>Orders Completed:</strong> {tailor.ordersCompleted}</p>
            <p><strong>Reviews:</strong> {tailor.reviews}</p>

            {/* Star Rating */}
            <div className="flex items-center my-3">
              <span className="text-yellow-500 flex">
                {Array(Math.floor(tailor.rating))
                  .fill()
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </span>
              <span className="ml-2 text-gray-600 text-sm">({tailor.reviews})</span>
            </div>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigHead;