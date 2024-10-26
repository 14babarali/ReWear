import React, {useState, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/seller/navbar';
// import Footer from '../components/footer';
import SellerHome from '../pages/seller/SellerHome';
import Catalogue from '../pages/seller/catalogue';
// import Uploadproducts from '../pages/seller/uploadproduct';
import SellerProfilePage from '../pages/seller/sellerprofile';
import OrdersPage from '../pages/seller/orders';
import BuyerReviews from '../components/buyerReview';
import LogoutPage from '../routes/logout';
import OTP from '../routes/OTPinput';
import AddProduct from '../pages/seller/newproduct';
import Sidebar from '../components/seller/Sidebar';
import ERR404 from '../components/error404';

const SellerLayout = () => {
  const [isSeller, setIsSeller] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user role in local storage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      if (user.role === 'Seller') {
        setIsSeller(true); // Set buyer state to true
      } else {
        // Redirect based on user role
        navigate(`/${user.role.toLowerCase()}`);
      }
    } else {
      navigate('/login'); // Redirect to login if no token/User logged in
    }
  }, [navigate]);


  return (
    <div>
    <Navbar/>
    {isSeller ? (
      <Routes>
            <Route path='/' element={<><Sidebar/><SellerHome /></>} />
            <Route path= '/OTP/verify' element={<OTP/>}/>
            {/* <Route path='/orders' element={<OrderDetail />} />  order details page */}
            <Route path='/catalogue' element={<><Sidebar/><Catalogue /></>} />
            <Route path='/product/add' element={<><Sidebar/><AddProduct/></>}/>
            {/* <Route path='/myproduct' element={<><Sidebar/><Uploadproducts /></>} /> */}
            <Route path='/profile' element={<><Sidebar/><SellerProfilePage /></>} />
            <Route path='/Orders' element={<><Sidebar/><OrdersPage /></>} />
            <Route path='/logout' element={<LogoutPage />} />
            <Route path='/reviews' element={<><Sidebar/><BuyerReviews /></>} />

            <Route path="*" element={<ERR404 />} /> {/* Consider adding a 404 page */}

      </Routes>
          ) : (
            // If not Seller, redirect to login
            <Navigate to="/login" replace={true} />
          )}
    {/* <Footer/> */}
    </div>
  );
};

export default SellerLayout;
