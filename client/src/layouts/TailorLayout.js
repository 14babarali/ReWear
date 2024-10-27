import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TailorNav from '../pages/tailor/TailorNav';
import TailorHome from '../pages/tailor/TailorHome';
import GigAdd from '../pages/tailor/GigAdd';
import OrderConfirm from '../pages/tailor/OrderConfirmation';
import OrderView from '../pages/tailor/TailorOrderView';
import TailorWork from '../pages/tailor/TailorWork';
import Catalogue from '../pages/tailor/Tailorcatalogue';
import TailorProfilePage from '../pages/tailor/Tailorprofile';
import OrdersPage from '../pages/tailor/TailorOrders';
import BuyerReviews from '../components/buyerReview';
import AddProduct from '../pages/tailor/newproduct';
import TailorSidebar from '../pages/tailor/TailorSidebar';
import ERR404 from '../components/error404';
import Gigs from '../pages/tailor/Gigs';
const TailorLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Set initial sidebar state to closed
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const [hasNavigated,setHasNavigated] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && !hasNavigated) {
      if (user.role !== 'Tailor') {
        setHasNavigated(true); // Set to true after navigating
        navigate('/' + user.role.toLowerCase());
      }
    }
  }, [navigate, hasNavigated]);

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      <TailorNav toggleSidebar={toggleSidebar} />
        <div  className="flex flex-1">
          <TailorSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
          <div  className={`flex-1 ${isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
            <Routes>
              <Route path="/" element={<TailorHome />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/profile" element={<TailorProfilePage />} />
              <Route path="/Gigs/add" element={<GigAdd />} />
              <Route path="/Gigs" element = {<Gigs/>}/>
              <Route path="/order-confirm" element={<OrderConfirm />} />
              <Route path="/view" element={<OrderView />} />
              <Route path="/work" element={<TailorWork />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/reviews" element={<BuyerReviews />} />
              <Route path="*" element={<ERR404 />} />
            </Routes>
          </div>
        </div>
    </div>
  );
};

export default TailorLayout;
