import React from 'react';
import { useLocation } from 'react-router-dom';
import AppHeader from './components/appheader';
import Footer from './components/footer';


const LayoutWrapper = ({ children }) => {
  const location = useLocation();

   // List of paths where AppHeader and Footer should be hidden
   const pathsWithoutHeaderFooter = ['/seller', '/myproduct', '/sellerprofile', '/tailor', '/catalogue', '/orders', '/verify_otp', '/Orders', '/reviews'];

   // Check if the current path should hide the header and footer
   const hideHeaderFooter = pathsWithoutHeaderFooter.some(path => location.pathname.startsWith(path));

  return (
    <>
      {/* Conditionally render AppHeader based on current location */}
      {!hideHeaderFooter && <AppHeader/>}

      {children}

      {/* Conditionally render Footer based on current location */}
      {!hideHeaderFooter && <Footer />}
    </>
  );
};

export default LayoutWrapper;
