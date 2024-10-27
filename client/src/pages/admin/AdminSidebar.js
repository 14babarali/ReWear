import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './AdminSidebar.css'; // Import the CSS file

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='d-flex' style={{flexDirection: 'column'}}>
        {/* Sidebar Header */}
      <div className="sidebar-header m-0">
        Admin
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav mt-2">
        <Link to="/admin/Dashboard" className="sidebar-link">
          <span className="material-icons-outlined">dashboard</span>
          <span className="ml-3">Dashboard</span>
        </Link>
        <Link to="/admin/Order" className="sidebar-link">
          <span className="material-icons-outlined">shopping_cart</span>
          <span className="ml-3">Orders</span>
        </Link>
        <Link to="/admin/Product" className="sidebar-link">
          <span className="material-icons-outlined">inventory_2</span>
          <span className="ml-3">Products</span>
        </Link>
        <Link to="#" className="sidebar-link">
          <span className="material-icons-outlined">analytics</span>
          <span className="ml-3">Reports</span>
        </Link>
        <Link to="/admin/Message" className="sidebar-link">
          <span className="material-icons-outlined">message</span>
          <span className="ml-3">Messages</span>
        </Link>
        <Link to="/admin/users" className="sidebar-link">
          <span className="material-icons-outlined">people</span>
          <span className="ml-3">Users</span>
        </Link>
      </nav>

      {/* Close Button */}
      <button className="sidebar-close-btn" onClick={toggleSidebar}>
        <span className="material-icons-outlined">close</span>
      </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
