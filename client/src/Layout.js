// import React from 'react';
// import BuyerNavbar from './components/appheader';
// import SellerNavbar from './pages/seller/navbar';
// import TailorNavbar from '../pages/seller/navbar';
// import Footer from './components/footer';
// // import AdminNavbar from './navbars/AdminNavbar';
// import { useLocation } from 'react-router-dom';

// const Layout = ({ user, children }) => {
//   const location = useLocation();
  
//   return (
//     <div>
//       {/* Conditionally render the correct navbar */}
//       {user?.role === 'Buyer' && <BuyerNavbar />}
//       {user?.role === 'Seller' && <SellerNavbar />}
//       {user?.role === 'Tailor' && <TailorNavbar />}
//       {user?.role === 'Admin' && <AdminNavbar />}
      
//       {/* Main content (children components like routes) */}
//       <main>{children}</main>

//        {user?.role === 'Buyer' && <Footer/>}

//     </div>
//   );
// };

// export default Layout;
