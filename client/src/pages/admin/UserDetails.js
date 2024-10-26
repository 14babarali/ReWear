// UserDetails.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UserDetails.css'; // Create a separate CSS file for styling

const UserDetails = () => {
  const { state } = useLocation();
  const user = state?.user;
  const navigate = useNavigate();

  if (!user) {
    return <p>No user data found. Please go back and select a user.</p>;
  }

  return (
    <div className="user-details-view">
      <h1>User Details</h1>
      <div className="user-details-content">
        <img src={user.profilePic} alt={user.name} className="profile-pic-large" />
        <div className="user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
      </div>

      {(user.role === 'seller' || user.role === 'tailor') && (
        <>
          <h3>CNIC Details</h3>
          <div className="cnic-images">
            <img src={user.cnicFront} alt="CNIC Front" className="cnic-pic-large" />
            <img src={user.cnicBack} alt="CNIC Back" className="cnic-pic-large" />
          </div>
        </>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default UserDetails;
