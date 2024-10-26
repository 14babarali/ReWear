import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheet/logout.css';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
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
