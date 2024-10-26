import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import TailorHome from './pages/tailor/TailorHome'; // Adjust the path according to your folder structure
// Import any other tailor-specific components here

function TailorRoutes() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user.role === 'Seller') {
            console.log('/seller');
            navigate('/tailor');
        } else if (user.role === 'Buyer') {
            console.log('Buyer');
            navigate('/');
        }
    }, [navigate]);
    
  return (
    <Routes>
      <Route path='/tailor' element={<TailorHome />} />
      {/* Add more tailor-specific routes here if needed */}
    </Routes>
  );
}

export default TailorRoutes;
