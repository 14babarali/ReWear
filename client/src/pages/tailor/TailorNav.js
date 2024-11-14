import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TailorNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const TailorNav = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // State to track current language
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Cleanup listener when component unmounts
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

  // Toggle dropdown menu
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Toggle language between English and Urdu
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Use i18n to change language globally
    console.log(`Language changed to: ${newLanguage}`);
  };

  const handleLogout = () => {
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
      <div className="text-center">
        <h2 className="admin-panel-title text-lg sm:text-xl">{t('tailorPanel')}</h2>
      </div>

      <div className="header-right flex items-center space-x-4">
        <span className="user-name hidden sm:inline-block">{user?.profile?.name}</span>

        <button className="notifications-button">
          <span className="material-icons-outlined">notifications</span>
        </button>

        {/* Language Toggle Button */}
        <button className="notifications-button" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faGlobe} /> {language === 'en' ? 'English' : 'Urdu'}
        </button>

        <div className="relative account-dropdown" ref={dropdownRef}>
          <button className="account-icon" onClick={toggleDropdown}>
            <span className="material-icons-outlined">account_circle</span>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 ${dropdownOpen ? 'block' : 'hidden'}`}
          >
            <span
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleProfileClick}
            >
              {t('Profile')}
            </span>
            <span
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              {t('Logout')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TailorNav;
