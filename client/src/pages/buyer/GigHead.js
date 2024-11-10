import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
const GigHead = ({ tailor, gig }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const url = 'http://localhost:3001/uploads/';
  return (
    <div className="flex items-center justify-between p-6" >
      <div className="flex items-center space-x-4">
      <img class="rounded-full h-40 w-40 max-w-[200px] max-h-[200px] object-cover" src={`${url}${gig.gigImage}`} alt={gig.gigImage} />
        <div className="text-white">
          <h1 className="text-2xl font-bold">{gig.title}</h1>
          <div className="text-gray-100">
            <p className="m-0">{gig.experience} Year's of Experience</p>
            <p className="m-0">{tailor.languages}</p>
            <p className="m-0">{tailor.ordersCompleted} orders completed</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Contact me
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 text-right">
        <span className="font-bold text-gray-100">{tailor.rating}</span> 
        <FaStar className="text-yellow-500" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col items-center bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <img
            className="w-28 h-28 rounded-full border-2 border-gray-200 mb-4"
            src={tailor.image ? `${url}${tailor.image}` : `${url}/uploads/no-image.jpg`}
            alt={tailor.profile?.name || 'Tailor'}
          />
          
          <p><strong>Name:</strong> {tailor.name}</p>
          <p><strong>Address:</strong> {tailor.location}</p>
          <p style={{ userSelect: 'none' }} onCopy={(e) => e.preventDefault()}>
            <strong>Contact Number:</strong> {tailor.phone}
          </p>
          <p><strong>Orders Completed:</strong> {tailor.ordersCompleted}</p>
          
          <button 
            onClick={() => setIsModalOpen(false)} 
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
