import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './stylesheet/logout.css';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Make the logout request if a token exists
        if (token) {
          await axios.post(
            'http://localhost:3001/api/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        // Remove user info and token from local storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    // Call the async function to log out
    logoutUser();
  }, [navigate]);

  return (
    <div className='logout-body'>
      <div className="logout-container">
        <div className="logout-message">You have been logged out. Redirecting to login page...</div>
        <div className="logout-spinner"></div>
      </div>
    </div>
  );
};

export default LogoutPage;
