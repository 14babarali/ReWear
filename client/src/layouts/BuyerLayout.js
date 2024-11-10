import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Navigate  } from 'react-router-dom';
import AppHeader from '../components/appheader';
import Footer from '../components/footer';
import Checkout from '../pages/buyer/checkout';
import Cart from '../pages/buyer/cart';
import Wishlist from '../pages/buyer/wishlist';
import CategoryLinks from '../pages/buyer/CategoryLinks';
import ProfilePage from '../routes/profile';
import Products from '../components/product_listing/products';
import ProductPage from '../components/productPage';
import UserDetails from '../components/UserDetails';
import Productinfo from '../components/Productinfo';
import OrdersPage from '../pages/buyer/order';
import Home from '../routes';
import Measurement from '../pages/buyer/BodyMeasurement';
import DataMeasurement from '../pages/buyer/DataMeasurement';
import TailorSearch from '../pages/buyer/TailorSearch';
import TailorCard from '../pages/buyer/TailorCard';
import ShowCase from '../pages/buyer/ShowCase';
import GigDes from '../pages/buyer/GigDes';
import GigPackage from '../pages/buyer/GigPackage';
import GigHead from '../pages/buyer/GigHead';
import DeliverParcel from '../pages/buyer/DeliverParcel';
import AboutUs from '../routes/AboutUs';
import PrivacyPolicy from '../routes/privacypolicy';
import Faqs from '../routes/Faqs';
import Payment from '../components/Payment';
import OTP from '../routes/OTPinput';
import ERR404 from '../components/error404';

const BuyerLayout = () => {
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && !hasNavigated) {
      if (user.role !== 'Buyer') {
        setHasNavigated(true);
        navigate('/' + user.role.toLowerCase());
      }
    }
  }, [navigate, hasNavigated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <div>
      <AppHeader />
      <div
        className="h-fit"
        style={{ justifyContent: 'center', margin: '5px', width: 'auto', height: '100%', overflow: 'scroll' }}
      >
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:category" element={<CategoryLinks />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/Seller" element={<UserDetails />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/productpage/:productId" element={<ProductPage />} />
          <Route path="/buyers_orders" element={<OrdersPage />} />
          <Route path="/Info" element={<Productinfo />} />
          <Route path="/measurement" element={<Measurement />} />
          <Route path="/DataMeasurement" element={<DataMeasurement />} />
          <Route path="/TailorSearch" element={<TailorSearch />} />
          <Route path="/Card" element={<TailorCard />} />
          <Route path="/ShowCase" element={<ShowCase />} />
          <Route path="/GigDes" element={<GigDes />} />
          <Route path="/GigPackage" element={<GigPackage />} />
          <Route path="/GigHead" element={<GigHead />} />
          <Route path="/DeliverParcel" element={<DeliverParcel />} />
          <Route path="/card-payment" element={<Payment />} />
          <Route path="/OTP/verify" element={<OTP />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Faqs" element={<Faqs />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<ERR404 />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default BuyerLayout;
