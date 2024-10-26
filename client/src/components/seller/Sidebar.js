import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorClosed,
  faPerson,
  faBars,
  faTachometerAlt,
  faClipboardList,
  faBox,
  faShoppingCart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control drawer visibility
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Fallback to empty object if user is null
  const userRole = user?.role; // Assuming 'role' field exists in the user object
  const cnicFrontExists = user?.profile?.cnicfront; // Check if cnicFront exists
  const cnicBackExists = user?.profile?.cnicback; // Check if cnicBack exists

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
    navigate('/logout');
  };

  return (
    <>
      {/* Button to toggle the drawer */}
      <button
        className="drawer-toggle-btn"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Drawer Sidebar */}
      <nav className={`sidebar vh-100 ${isDrawerOpen ? "open" : ""}`}>
        <ul className="sidebar-nav">
          {userRole !== "buyer" && (
            <>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/seller"
                  end
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faTachometerAlt} /> {t("Dashboard")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/seller/catalogue"
                  className={`sidebar-nav-link ${
                    !cnicFrontExists || !cnicBackExists ? "disabled-link" : ""
                  }`}
                  onClick={(e) => {
                    if (!cnicFrontExists || !cnicBackExists) {
                      e.preventDefault();
                      alert(
                        "Please upload your CNIC front and back images to access this page."
                      );
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  {t("Catalogue")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/seller/AddProduct"
                  className={`sidebar-nav-link ${
                    !cnicFrontExists || !cnicBackExists ? "disabled-link" : ""
                  }`}
                  onClick={(e) => {
                    if (!cnicFrontExists || !cnicBackExists) {
                      e.preventDefault();
                      alert(
                        "Please upload your CNIC front and back images to access this page."
                      );
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faBox} />
                  {t("My Products")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/seller/Orders"
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> {t("Orders")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/seller/reviews"
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faStar} /> {t("Buyers Reviews")}
                </NavLink>
              </li>
            </>
          )}
          {/* Common Links */}
          <li className="sidebar-nav-item">
            <NavLink
              to="/seller/profile"
              className={({ isActive }) =>
                isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
              }
            >
              <FontAwesomeIcon icon={faPerson} /> {t("Profile")}
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <span
              className="sidebar-nav-link"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faDoorClosed} /> {t("Logout")}
            </span>
          </li>
        </ul>
      </nav>

      {/* Clickable overlay to close the drawer */}
      {isDrawerOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;




// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import './Sidebar.css'; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDoorClosed, faPerson } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { t } = useTranslation();


//   // Retrieve user data from local storage
//   const user = JSON.parse(localStorage.getItem('user'));
//   const userRole = user?.role; // Assuming 'role' field exists in the user object
//   const cnicFrontExists = user?.profile?.cnicfront; // Check if cnicFront exists
//   const cnicBackExists = user?.profile?.cnicback;   // Check if cnicBack exists
//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         navigate('/buyer/login');
//         return;
//       }

//       await axios.post(
//         'http://localhost:3001/api/logout',
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       localStorage.removeItem('user');
//       localStorage.removeItem('token');

//       console.log('User Logged out Successfully');
//       navigate('/seller/logout');
//     } catch (error) {
//       let errorMsg = 'An unexpected error occurred.';
//       if (error.response) {
//         errorMsg = error.response.data.message;
//         console.log(errorMsg);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         navigate('/seller/logout');
//       } else if (error.request) {
//         errorMsg = 'Network error. Please try again later.';
//         console.log(errorMsg);
//       }
//     }
//   };

//   return (
//     <nav className="sidebar vh-100">
//       <ul className="sidebar-nav">
//         {/* Conditionally render links based on user role */}
//         {userRole !== 'buyer' && (
//           <>
//             <li className="sidebar-nav-item">
//               <NavLink
//                 exact
//                 to="/seller/"
//                 className="sidebar-nav-link"
//                 activeclassname="active"
//               >
//                 {t('Dashboard')}
//               </NavLink>
//             </li>
//             <li className="sidebar-nav-item">
//               <NavLink
//                 to="/seller/catalogue"
//                 className={`sidebar-nav-link ${(!cnicFrontExists || !cnicBackExists) ? 'disabled-link' : ''}`}
//                 activeclassname="active"
//                 onClick={(e) => {
//                   if (!cnicFrontExists || !cnicBackExists) {
//                     e.preventDefault();
//                     alert('Please upload your CNIC front and back images to access this page.');
//                   }
//                 }}
//               >
//                 {t('Catalogue')}
//               </NavLink>
//             </li>
//             <li className="sidebar-nav-item">
//               <NavLink
//                 to="/seller/myproduct"
//                 className={`sidebar-nav-link ${(!cnicFrontExists || !cnicBackExists) ? 'disabled-link' : ''}`}
//                 activeclassname="active"
//                 onClick={(e) => {
//                   if (!cnicFrontExists || !cnicBackExists) {
//                     e.preventDefault();
//                     alert('Please upload your CNIC front and back images to access this page.');
//                   }
//                 }}
//               >
//                 {t('My Products')}
//               </NavLink>
//             </li>
//             <li className="sidebar-nav-item">
//               <NavLink
//                 to="/seller/Orders"
//                 className="sidebar-nav-link"
//                 activeclassname="active"
//               >
//                 {t('Orders')}
//               </NavLink>
//             </li>
//             <li className="sidebar-nav-item">
//               <NavLink
//                 to="/seller/reviews"
//                 className="sidebar-nav-link"
//                 activeclassname="active"
//               >
//                 {t('Buyers Reviews')}
//               </NavLink>
//             </li>
//           </>
//         )}
//         {/* Common Links */}
//         <li className="sidebar-nav-item">
//           <NavLink
//             to="/seller/contact"
//             className="sidebar-nav-link"
//             activeclassname="active"
//           >
//             {t('Complaints')}
//           </NavLink>
//         </li>
//         <li className="sidebar-nav-item">
//           <NavLink
//             to="/seller/profile"
//             className="sidebar-nav-link"
//             activeclassname="active"
//           >
//             <FontAwesomeIcon icon={faPerson} /> {t('Profile')}
//           </NavLink>
//         </li>
//         <li className="sidebar-nav-item">
//           <span
//             className="sidebar-nav-link"
//             activeclassname="active"
//             onClick={handleLogout}
//             style={{ cursor: 'pointer' }}
//           >
//             <FontAwesomeIcon icon={faDoorClosed} /> {t('Logout')}
//           </span>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Sidebar;
