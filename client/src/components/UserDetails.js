import React from 'react';
import './stylesheets/UserDetails.css'; // Create this CSS file for UserDetails styling

const UserDetails = () => {
  const seller = {
    name: 'Talha Masood',
    image: 'https://example.com/seller-profile.jpg', // Replace with actual image path
    date: 'May 30, 2023',
    location: 'Lahore, Pakistan',
  };

  return (
    <div className="super-dooper-unique-user-details-container-23947">
      <div className="super-dooper-unique-user-details-23947">
        <img src={seller.image} alt="Seller Profile" className="super-dooper-unique-profile-image-23947" />
        <div className="super-dooper-unique-user-info-23947">
          <h4 className="super-dooper-unique-user-name-23947">{seller.name}</h4>
          <p className="super-dooper-unique-published-by-23947">
            {seller.date} <span className="super-dooper-unique-separator-23947">|</span> {seller.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
