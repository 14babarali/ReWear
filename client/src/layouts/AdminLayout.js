import React, { useState, useEffect } from 'react'; 
import { Routes, Route, Navigate  } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard.js';
import AdminSidebar from '../pages/admin/AdminSidebar.js';
import AdminOrder from '../pages/admin/AdminOrder.js';
import AdminProduct from '../pages/admin/AdminProduct.js';
import AdminMessage from '../pages/admin/AdminMessage.js';
import AdminUsers from '../pages/admin/Adminusers.js';
import AdminProfilePage from '../pages/admin/AdminProfilePage.js';
import UserDetails from '../pages/admin/UserDetails.js';
import Navbar from '../pages/admin/AdminNav.js';
import ERR404 from '../components/error404';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Set initial sidebar state to closed
  // const [isAdmin, setIsAdmin] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && !hasNavigated) {
      if (user.role !== 'Admin') {
        setHasNavigated(true); // Set to true after navigating
        navigate('/' + user.role.toLowerCase());
      }
    }
  }, [navigate, hasNavigated]);

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Navbar */}
      <div className="flex flex-1">
        {/* Sidebar component with toggleSidebar passed */}
        <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
          <Routes>
            {/* Admin Dashboard route */}
            <Route path="/" element={<AdminDashboard />} />
            {/* Admin Orders route */}
            <Route path="/Dashboard" element={<AdminDashboard />} />
            <Route path="/Order" element={<AdminOrder />} />
            <Route path="/Product" element={<AdminProduct />} />
            <Route path="/Message" element={<AdminMessage />} />
            <Route path="/Users" element={<AdminUsers />} />
            <Route path="/Profile" element={<AdminProfilePage />} />
            <Route path="/Details" element={<UserDetails />} />
            <Route path="*" element={<ERR404 />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
