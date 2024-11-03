import React from 'react';
import './stylesheets/UserDetails.css'; // Create this CSS file for UserDetails styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const UserDetails = ({product}) => {
  const user = product.userId;
  const img = `http://localhost:3001/uploads/${user.profile.profilePicture}`
  // console.log(img);
  const seller = {
    name: user.profile.name ? user.profile.name : 'User',
    image: img,
    date: user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }): 'Date not provided',
    location: user.profile.addresses.length > 0 
              ? `${user.profile.addresses[0].street}, ${user.profile.addresses[0].city}, ${user.profile.addresses[0].postalcode}` 
              : 'Location not provided',
  };

  return (
    <div className="super-dooper-unique-user-details-container-23947">
      <div className="super-dooper-unique-user-details-23947">
        <img src={seller.image} alt="Seller Profile" className="super-dooper-unique-profile-image-23947" onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:3001/uploads/no-image.jpg'; }} />
        <div className="super-dooper-unique-user-info-23947">
          <h4 className="super-dooper-unique-user-name-23947">
            {seller.name} 
            {user.isVerified && (
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', marginLeft: '5px' }} />
            )}
          </h4>
          <p className="super-dooper-unique-published-by-23947">
            Member Since<span className="super-dooper-unique-separator-23947"/>| {seller.date}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
