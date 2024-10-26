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
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // State to control drawer visibility
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Retrieve user data from local storage
  const user = JSON.parse(localStorage.getItem("user")) || {}; // Fallback to empty object if user is null
  const userRole = user?.role; // Assuming 'role' field exists in the user object

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      await axios.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fix: Backticks for token interpolation
          },
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      console.log("User Logged out Successfully");
      navigate("/logout"); // Redirect to login page
    } catch (error) {
      let errorMsg = "An unexpected error occurred.";
      if (error.response) {
        errorMsg = error.response.data.message;
        console.log(errorMsg);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.request) {
        errorMsg = "Network error. Please try again later.";
        console.log(errorMsg);
      }
    }
  };

  return (
    <>
      {/* Button to toggle the drawer */}
      {/* <button
        className="drawer-toggle-btn"
        onClick={() => setIsDrawerOpen(isDrawerOpen)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button> */}

      {/* Drawer Sidebar */}
      <nav className={`sidebar vh-100 ${isDrawerOpen ? "open" : ""}`}>
        <ul className="sidebar-nav">
          {userRole !== "Buyer" && userRole !== "Seller" && userRole !== "Admin" && (
            <>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor"
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
                  to="/tailor/catalogue"
                  className="sidebar-nav-link"
                >
                  <FontAwesomeIcon icon={faClipboardList} />
                  {t("Catalogue")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor/AddProduct"
                  className="sidebar-nav-link"
                >
                  <FontAwesomeIcon icon={faBox} />
                  {t("My Products")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor/Orders"
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> {t("Orders")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor/Gig"
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faStar} /> {t("Gig")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor/View"
                  className={({ isActive }) =>
                    isActive ? "active sidebar-nav-link" : "sidebar-nav-link"
                  }
                >
                  <FontAwesomeIcon icon={faStar} /> {t("View")}
                </NavLink>
              </li>
              <li className="sidebar-nav-item">
                <NavLink
                  to="/tailor/reviews"
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
              to="/tailor/profile"
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
      {/* {isDrawerOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )} */}
    </>
  );
};

export default Sidebar;
