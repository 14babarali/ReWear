import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import TailorLayout from './layouts/TailorLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './routes';
import Login from './routes/login';
import Register from './routes/register';
import AppHeader from './components/appheader';
import Footer from './components/footer';
import OTPinput from './routes/OTPinput'
import LogoutPage from './routes/logout';
import Faqs from './routes/Faqs';
import AboutUs from './routes/AboutUs';
import PrivacyPolicy from './routes/privacypolicy';
import Navbar from './pages/seller/navbar';
import Tailornavbar from './pages/tailor/Tailornavbar';


const getNavbarByRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.role === 'Admin') {
    return <Navbar />;
  } else if (user && user.role === 'Buyer') {
    return <AppHeader />;
  } else if (user && user.role === 'Seller') {
    return <Navbar />;
  } else if (user && user.role === 'Tailor') {
    return <Tailornavbar />;
  } else {
    return <AppHeader />;
  }
};

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener('online', handleStatusChange);

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
}, [isOnline]);

  return (
    <Router>

      <Routes>
        
        {/* General Routes For all type of users */}
        <Route path="/" element={<><AppHeader/><Home /><Footer/></>} />
        <Route path="/login" element={<><AppHeader/><Login/><Footer/></>} />
        <Route path="/register" element={<><AppHeader/><Register /><Footer/></>} />
        <Route path='/logout' element={<LogoutPage/>}/>
        <Route path="/OTPinput" element={<OTPinput />} />

        <Route path='/privacy-policy' element={<><>{getNavbarByRole()}</><PrivacyPolicy/><Footer/></>} />
        <Route path='/AboutUs' element={<><>{getNavbarByRole()}</><AboutUs /><Footer/></> }/>
        <Route path="/Faqs" element={<><>{getNavbarByRole()}</><Faqs /><Footer/></> }/>

        {/* User Specific Routes for only that type of user */}

        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/buyer/*" element={<BuyerLayout />} />
        <Route path="/seller/*" element={<SellerLayout />} />
        <Route path="/tailor/*" element={<TailorLayout />} />

      </Routes>

    </Router>
  );
}

export default App;
