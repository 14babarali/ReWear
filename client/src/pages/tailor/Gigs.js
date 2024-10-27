import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Gigs.css'; // CSS file for styling

const Gigs = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        console.error('User not found in localStorage');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:3001/gigs/mygig`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token if using authentication
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
      {gigs.map((gig) => (
        <div className="gig-card" key={gig._id}>
          <img
            src={`http://localhost:3001/uploads/${gig.gigImage}`}
            alt="Gig"
            className="gig-card-image"
          />
          <div className="gig-card-content">
            <h3>{gig.user.username}</h3>
            <p>{gig.description}</p>
            <div className="gig-skills">
              {gig.skills.map((skill, index) => (
                <span key={index} className="skill">
                  {skill}
                </span>
              ))}
            </div>
            <div className="gig-prices">
              <p>Basic Price: PKR {gig.basicPrice}</p>
              <p>Premium Price: PKR {gig.premiumPrice}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gigs;
