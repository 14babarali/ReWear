import React from 'react';
import { useNavigate } from 'react-router-dom';

const TailorCard = ({ gig }) => {
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:3001';
  const user = gig.user;
  const handleRedirect = () => {
    navigate(`/buyer/ShowCase`, { state: { gig } });
  };

  // Check if tailor object exists and provide fallback values
  if (!gig) return null;

  return (
    <div
      className="w-full max-w-xs rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-2xl transform transition duration-300 hover:scale-105 cursor-pointer m-4"
      onClick={handleRedirect}
    >
      {/* Profile Cover Image with Gradient Overlay */}
      <div className="relative">
        <img
          className="w-full h-32 lg:h-48 object-cover"
          src={gig.gigImage ? `${backendUrl}/uploads/${gig.gigImage}` : `${backendUrl}/uploads/no-image.jpg`}
          alt={gig.title || 'Tailor'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Avatar and Name */}
        <h3>{gig.title}</h3>
        <div className="flex items-center space-x-3 mb-3">
          {/* <img
            className="w-12 h-12 rounded-full border-2 border-gray-200"
            src={user.profile ? `${backendUrl}/uploads/${user.profile.profilePicture}` : `${backendUrl}/uploads/no-image.jpg`}
            alt={user.profile?.name || 'Tailor'}
          /> */}
          <div className="flex flex-col">
            {/* <h3 className="text-lg font-semibold text-gray-800">{user.profile?.name || 'Unknown Tailor'}</h3> */}
            <span className="text-xs font-light text-gray-500">Member Since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Additional Details (Experience and Location) */}
        <p className="text-gray-700 text-sm mb-2">
          <strong>Experience:</strong> {gig.experience ? `${gig.experience} years` : 'N/A'}
        </p>
        <p className="text-gray-700 text-sm mb-4">
          <strong>Location:</strong> {user.profile?.addresses[0]?.city || 'N/A'}
        </p>

        {/* View Profile Button */}
        <button
          className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 text-center"
          onClick={handleRedirect}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TailorCard;
