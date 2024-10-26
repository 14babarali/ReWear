import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminNav.css';

const AdminNav = ({ toggleSidebar }) => {
  const [user, setUser] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user from localStorage
    }
  },[]);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Logout function
  const handleLogout = async () => {
    navigate('/logout');
  };

  // Handle navigation to profile page
  const handleProfileClick = () => {
    navigate('/admin/Profile'); // Ensure this is the correct route for your admin profile
  };

  return (
    <header className="header">
      {/* Sidebar toggle button */}
      <button className="menu-toggle-button" onClick={toggleSidebar}>
        <span className="material-icons-outlined">menu</span>
      </button>

      <h2 className="admin-panel-title">Admin Panel</h2>

      <div className="header-right">
        <span className="user-name">{user?.profile?.name}</span>

        {/* Notifications Icon */}
        <button className="notifications-button">
          <span className="material-icons-outlined">notifications</span>
        </button>

        {/* Account Icon with Dropdown */}
        <div className="account-dropdown">
          <button className="account-icon" onClick={toggleDropdown}>
            <span className="material-icons-outlined">account_circle</span>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 ${
              dropdownOpen ? 'block' : 'hidden'
            }`}
          >
            <span
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleProfileClick}
            >
              Profile
            </span>
            <span
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNav;
