import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import seller_logo from '../../assests/rewear-logo.png';
import './navbar.css';
import '../../i18n'; // Assumes the i18n configuration is in the src folder
import i18next from 'i18next';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // const [name, setName] = useState(null);
  // const [profileImage, setProfileImage] = useState(null); // State for profile image
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control Sidebar visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [signalStrength, setSignalStrength] = useState(0);
  const { t } = useTranslation();


  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const languageRef = useRef(null);
  const languageButtonRef = useRef(null);

  // useEffect(() => {
  //   // const storedUser = localStorage.getItem('user');
  //   // if (storedUser) {
  //   //   const userData = JSON.parse(storedUser);
  //   //   setName(userData.profile.name);
  //   //   setProfileImage(userData.profile.profilePicture);
  //   // }

  //   // Update online status based on network events
  //   const handleOnline = () => setIsOnline(true);
  //   const handleOffline = () => setIsOnline(false);

  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, []);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const effectiveType = connection.effectiveType;

        if (effectiveType === '4g') {
          setSignalStrength(4); // Strongest signal
        } else if (effectiveType === '3g') {
          setSignalStrength(3);
        } else if (effectiveType === '2g') {
          setSignalStrength(2);
        } else {
          setSignalStrength(1); // Weak signal
        }
      } else {
        setSignalStrength(isOnline ? 4 : 0); // Use online/offline as fallback
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      updateOnlineStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSignalStrength(0); // No signal
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateOnlineStatus(); // Initial call to set signal status

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);
  
  // Adjust the bar rendering based on signal strength
  
  
  // Adjust the bar rendering based on signal strength
  

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen); // Toggle Sidebar visibility
  // };

  const toggleLanguage = (lang) => {
    i18next.changeLanguage(lang); 
    console.log('Language changed to:', lang);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageBlur = (e) => {
    if (languageRef.current && languageRef.current.contains(e.relatedTarget)) {
      return; // If focus is still within the language menu, do nothing
    }
    setIsDropdownOpen(false);
  }

  // const handleFocus = () => {
  //   setIsSidebarOpen(true); // Open menu on focus
  // };
  
  const handleSidebarBlur = (e) => {
    // Check if the focus is moving to an element inside the sidebar
    if (sidebarRef.current && sidebarRef.current.contains(e.relatedTarget)) {
      return; // If focus is still within the sidebar, do nothing
    }
    setIsSidebarOpen(false); // Close sidebar if focus moves outside
  };

  return (
    <>
      <nav className="navbar ">
        <div className="navbar-content">
          <div className="navbar-left">
            
            {/* <button className="sidebar-toggler" 
               ref={menuButtonRef}
              onClick={toggleSidebar} 
              onBlur={handleSidebarBlur}
            >
              <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
            </button> */}
            <Link to={'/seller'}>
            <img src={`${seller_logo}`} alt="Profile" className="navbar-image" />
            </Link>
            <h4>{t('Sellers View')}</h4>
          
          </div>
          <div className="navbar-right">
          
          <span className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
              <div className={`signal-bar bar-1`}></div>
              {signalStrength >= 2 && <div className={`signal-bar bar-2`}></div>}
              {signalStrength >= 3 && <div className={`signal-bar bar-3`}></div>}
              {signalStrength >= 4 && <div className={`signal-bar bar-4`}></div>}
          </span>

          
            <div className="language-selector">
          
              <button 
                ref={languageButtonRef}
                onClick={handleDropdownToggle} 
                onBlur={handleLanguageBlur}
                className="language-icon" >
                <FontAwesomeIcon icon={faGlobe} />
              </button>
          
              {isDropdownOpen && (
          
                <div className="language-dropdown"
                ref={languageRef}
                // onFocus={handleFocus} // Keep open when focused
                onBlur={handleLanguageBlur} // Close when focus leaves
                tabIndex="-1" // Ensure the sidebar itself is focusable
                >
                  <ul>
                    <li onClick={() => toggleLanguage('en')}>English</li>
                    <li onClick={() => toggleLanguage('ur')}>Urdu</li>
                  </ul>
                </div>

              )}

            </div>
          </div>
        </div>
      </nav>
      
      {/* Sidebar rendering based on isSidebarOpen
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          // onFocus={handleFocus} // Keep open when focused
          onBlur={handleSidebarBlur} // Close when focus leaves
          tabIndex="-1" // Ensure the sidebar itself is focusable
        >
          <Sidebar />
        </div>
      )} */}
    </>
  );
};

export default Navbar;
