import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const TailorCard = ({ tailor }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/buyer/ShowCase`);
  };

  // Check if tailor object exists and provide fallback values
  if (!tailor) return null;

  return (
    <div
      className="max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 m-4 transform transition duration-500 hover:scale-105 cursor-pointer"
      onClick={handleRedirect} // Redirects to the Showcase page on click
    >
      {/* Profile Cover Image */}
      <img
        className="w-full h-36 object-cover"
        src={tailor.profilePicture || 'https://via.placeholder.com/400x200'} // Fallback image
        alt={tailor.name || 'Tailor'}
      />

      <div className="p-4">
        {/* Avatar and Name */}
        <div className="flex items-center space-x-2">
          <img
            className="w-10 h-10 rounded-full"
            src={tailor.avatar || 'https://via.placeholder.com/50'} // Fallback avatar
            alt={tailor.name || 'Tailor'}
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{tailor.name || 'Unknown Tailor'}</h3>
            <p className="text-sm text-gray-500">{tailor.tagline || 'No tagline available'}</p>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center my-3">
          <span className="text-yellow-500 flex">
            {Array(Math.floor(tailor.rating || 0))
              .fill()
              .map((_, i) => (
                <FaStar key={i} />
              ))}
          </span>
          <span className="ml-2 text-gray-600 text-sm">({tailor.reviews || 0})</span>
        </div>

        {/* Additional Details (Experience and Location) */}
        <p className="text-gray-700 text-sm">
          <strong>Experience:</strong> {tailor.experience ? `${tailor.experience} years` : 'N/A'}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Location:</strong> {tailor.location || 'Unknown location'}
        </p>

        {/* Price Information */}
        <p className="text-blue-500 font-semibold text-lg mt-3">
          From PKR {tailor.price || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default TailorCard;
