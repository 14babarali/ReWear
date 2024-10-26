import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './TailorSidebar.css'; // Import the CSS file

const TailorSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        ReWear
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/tailor/" className="sidebar-link">
          <span className="material-icons-outlined">dashboard</span>
          <span className="ml-3">Dashboard</span>
        </Link>
        <Link to="/tailor/orders" className="sidebar-link">
          <span className="material-icons-outlined">shopping_cart</span>
          <span className="ml-3">Orders</span>
        </Link>
        <Link to="/tailor/catalogue" className="sidebar-link">
          <span className="material-icons-outlined">inventory_2</span>
          <span className="ml-3">Products</span>
        </Link>
        <Link to="/tailor/gig" className="sidebar-link">
          <span className="material-icons-outlined">analytics</span>
          <span className="ml-3">Gig</span>
        </Link>
        <Link to="/tailor/view" className="sidebar-link">
          <span className="material-icons-outlined">message</span>
          <span className="ml-3">Messages</span>
        </Link>
        <Link to="/tailor/reviews" className="sidebar-link">
          <span className="material-icons-outlined">people</span>
          <span className="ml-3">Users</span>
        </Link>
      
      </nav>

      {/* Close Button */}
      <button className="sidebar-close-btn" onClick={toggleSidebar}>
        <span className="material-icons-outlined">close</span>
      </button>
    </aside>
  );
};

export default TailorSidebar;
