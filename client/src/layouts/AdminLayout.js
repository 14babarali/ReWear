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

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Set initial sidebar state to closed
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Check for token and user role in local storage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    // Only navigate if not already navigated
    if (!hasNavigated) {
      if (token && user) {
        if (user.role === 'Admin') {
          setIsAdmin(true); // Set admin state to true
          setHasNavigated(true); // Set navigation flag
          navigate('/admin');
        } else if (user.role === 'Seller') {
          setHasNavigated(true);
          navigate('/seller');
        } else if (user.role === 'Buyer') {
          setHasNavigated(true);
          navigate('/buyer');
        } else if (user.role === 'Tailor') {
          setHasNavigated(true);
          navigate('/tailor');
        } else {
          setHasNavigated(true);
          navigate('/logout');
        }
      } else {
        // If no token or user, navigate to login
        setHasNavigated(true);
        navigate('/login');
      }
    }
  }, [navigate, hasNavigated ]);

  return (
    <div className="admin-layout flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Navbar */}
      <div className="flex flex-1">
        {/* Sidebar component with toggleSidebar passed */}
        <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {isAdmin ? (
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
          </Routes>
          ) : (
            // Redirect if isAdmin is false
            <Navigate to="/login" replace={true} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
