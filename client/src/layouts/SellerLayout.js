import React, {useState, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SellerNav from '../pages/seller/SellerNav';
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
import SellerSidebar from '../pages/seller/SellerSidebar';
import ERR404 from '../components/error404';

const SellerLayout = () => {
  const navigate = useNavigate();
  const [hasNavigated,setHasNavigated] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Set initial sidebar state to closed
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
    <div className="admin-layout flex flex-col min-h-screen m-0">
      <SellerNav toggleSidebar={toggleSidebar} />
        <div  className="flex flex-1">
          <SellerSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <div  className={`flex-1 ${isOpen ? 'ml-60' : 'ml-0'} transition-all duration-300`} style={{justifyContent:'center', alignItems: 'center'}}>
            <Routes>
              <Route path='/Dashboard' element={<SellerHome />} />
              {/* <Route path= '/OTP/verify' element={<OTP/>}/> */}
              
              {/* <Route path='/orders' element={<OrderDetail />} />  order details page */}
              <Route path='/catalogue' element={<Catalogue />} />
              <Route path='/product/add' element={<AddProduct/>}/>
              
              {/* <Route path='/myproduct' element={<Uploadproducts />} /> */}
              <Route path='/profile' element={<SellerProfilePage />} />
              <Route path='/Orders' element={<OrdersPage />} />
              <Route path='/reviews' element={<BuyerReviews />} />

              <Route path='/' element={<SellerHome />} />
              <Route path="*" element={<ERR404 />} />

            </Routes>
          </div>
        </div>
    </div>
  );
};

export default SellerLayout;
