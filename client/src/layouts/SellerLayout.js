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
  const navigate = useNavigate();
  const [hasNavigated,setHasNavigated] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && !hasNavigated) {
      if (user.role !== 'Seller') {
        setHasNavigated(true); // Set to true after navigating
        navigate('/' + user.role.toLowerCase());
      }
    }
  }, [navigate, hasNavigated]);


  return (
    <div>
    <Navbar/>
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

        <Route path="*" element={<ERR404 />} />

      </Routes>
    {/* <Footer/> */}
    </div>
  );
};

export default SellerLayout;
