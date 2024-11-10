import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TailorNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const TailorNav = ({ toggleSidebar }) => {
  const [user, setUser] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    navigate('/logout');
  };

  const handleProfileClick = () => {
    navigate('/tailor/profile');
  };

  return (
    <header className="header flex flex-wrap items-center justify-between p-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center">
        <button className="menu-toggle-button mr-4" onClick={toggleSidebar}>
          <span className="material-icons-outlined">menu</span>
        </button>
      </div>
      <div className='text-center'>
      <h2 className="admin-panel-title text-lg sm:text-xl">Tailor Panel</h2>
      </div>

      <div className="header-right flex items-center space-x-4">
        <span className="user-name hidden sm:inline-block">{user?.profile?.name}</span>

        <button className="notifications-button">
          <span className="material-icons-outlined">notifications</span>
        </button>

        <button className="notifications-button">
          <FontAwesomeIcon icon={faGlobe} />
        </button>

        <div className="relative account-dropdown" ref={dropdownRef}>
          <button className="account-icon" onClick={toggleDropdown}>
            <span className="material-icons-outlined">account_circle</span>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 ${
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

export default TailorNav;
