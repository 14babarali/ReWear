import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Gigs.css'; // CSS file for styling

const Gigs = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No Token');
        return;
      }
  
      try {
        const response = await axios.get('http://localhost:3001/gigs/my-gigs', {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if using authentication
          },
        });
        setGigs(response.data);
      } catch (error) {
        console.error('Error fetching gigs:', error);
      }
    };
  
    fetchGigs();
  }, []);
  

  return (
    <div className="gig-card-container">
        <div>
            <Link to={'/tailor/Gigs/add'}>
                Add New Gig
            </Link>
        </div> 
        {gigs.length === 0 ? (
        <p>No gigs available.</p>
      ) : (
        gigs.map((gig) => (
          <div className="gig-card" key={gig._id}>
            <img
              src={`http://localhost:3001/uploads/${gig.gigImage}`}
              alt="Gig"
              className="gig-card-image"
            />
            <div className="gig-card-content">
              <h3>{gig.title}</h3> {/* Display Gig Title */}
              {/* <h4>Created by: {gig.user.username}</h4> */}
              <p>{gig.description}</p> {/* Display Gig Description */}
              <div className="gig-service-fabric">
                <p><strong>Service Type:</strong> {gig.serviceType}</p> {/* Display Service Type */}
                <p><strong>Fabric Type:</strong> {gig.fabricType}</p> {/* Display Fabric Type */}
              </div>
              <div className="gig-prices">
                <p>Basic Price: PKR {gig.basicPrice}</p> {/* Display Basic Price */}
                <p>Premium Price: PKR {gig.premiumPrice}</p> {/* Display Premium Price */}
              </div>
              <p><strong>Delivery Days:</strong> 
                <p>Basic: {gig.basicDeliveryDays} days</p>
                <p>Premium: {gig.premiumDeliveryDays} days</p>
              </p> {/* Delivery Days */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Gigs;
