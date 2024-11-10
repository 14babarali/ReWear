import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheet/logout.css';
import axios from 'axios';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Send logout request to the backend with token
          await axios.post(
            'http://localhost:3001/api/logout',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        
        // Clear token and user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // localStorage.removeItem('cookiesAccepted');

        // Set timer for redirect
        const timer = setTimeout(() => {
          navigate('/login');
        }, 3000);

        return () => clearTimeout(timer);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className='logout-body'>
    <div className="logout-container">
      <div className="logout-message">You have been logged out, Redirecting to login page...</div>
      <div className="logout-spinner"></div>
    </div>
    </div>
  );
};

export default LogoutPage;
