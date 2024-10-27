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
