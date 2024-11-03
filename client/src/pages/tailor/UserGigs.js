import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserGigs = () => {
  const [gigs, setGigs] = useState([]);
  const url = "http://localhost:3001"; // Adjust as per your backend server's base URL

  // Fetch gigs on component mount
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get(`${url}/gigs/myGig`);
        setGigs(response.data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="gigs-container">
      {gigs.map((gig, index) => (
        <section key={index} className="flex bg-gray-100 rounded-lg shadow-md p-4 mb-3 w-full" style={{alignItems: 'center'}}>
          <img
            src={gig.gigImage ? url + gig.gigImage : "https://via.placeholder.com/150"}
            alt="Gig"
            className="rounded w-32 h-32 mr-4"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{gig.title}</h1>
            <p><strong>Description:</strong> {gig.description}</p>
            <p><strong>Services:</strong> {gig.services.join(', ')}</p>
            <p><strong>Experience:</strong> {gig.experience} years</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default UserGigs;
