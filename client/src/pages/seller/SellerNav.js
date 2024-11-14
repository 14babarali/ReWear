import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './SellerNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const TailorNav = ({ toggleSidebar }) => {
  const [user, setUser] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user from localStorage
    }
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle language between English and Urdu
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ur' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Use i18n to change language globally
    console.log(`Language changed to: ${newLanguage}`);
  };

  // Logout function
  const handleLogout = async () => {
    navigate('/logout');
  };

  // Handle navigation to profile page
  const handleProfileClick = () => {
    navigate('/seller/profile'); // Ensure this is the correct route for your admin profile
  };

  return (
    <header className="header w-full">
      {/* Sidebar toggle button */}
      <button className="menu-toggle-button" onClick={toggleSidebar}>
        <span className="material-icons-outlined">menu</span>
      </button>

      <h2 className="admin-panel-title">{t('seller_panel')}</h2>

      <div className="header-right">
        <span className="user-name">{user?.profile?.name}</span>

        {/* Notifications Icon */}
        <button className="notifications-button">
          <span className="material-icons-outlined">notifications</span>
        </button>

        {/* Language Toggle Button */}
        <button className="notifications-button" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faGlobe} /> {language === 'en' ? t('english') : t('urdu')}
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
              {t('profile')}
            </span>
            <span
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              {t('logout')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TailorNav;
