import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './AdminSidebar.css'; // Import the CSS file
import generateReport from './AdminReports';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar w-auto ${isOpen ? 'open' : ''}`}>
      <div className='d-flex' style={{flexDirection: 'column', gap:'10px'}}>
        {/* Sidebar Header */}
        <div className="sidebar-header p-2">
          <span className='text-base'>
          <h3 className='m-0'><strong>ReWear</strong></h3>
          </span>
          <button className="sidebar-close-btn p-0" onClick={toggleSidebar}>
          <span className="material-icons-outlined text-2xl">close</span>
        </button>
        </div>
        
      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/admin/Dashboard" className="sidebar-link">
          <span className="material-icons-outlined">dashboard</span>
          <span className="ml-3 text-base">Dashboard</span>
        </Link>
        <Link to="/admin/Order" className="sidebar-link">
          <span className="material-icons-outlined">shopping_cart</span>
          <span className="ml-3 text-base">Orders</span>
        </Link>
        <Link to="/admin/Product" className="sidebar-link">
          <span className="material-icons-outlined">inventory_2</span>
          <span className="ml-3 text-base">Products</span>
        </Link>
        <Link to="/admin/Report" className="sidebar-link" onClick={generateReport}>
          <span className="material-icons-outlined">analytics</span>
          <span className="ml-3 text-base">Reports</span>
        </Link>
        <Link to="/admin/Message" className="sidebar-link">
          <span className="material-icons-outlined">message</span>
          <span className="ml-3 text-base">Messages</span>
        </Link>
        <Link to="/admin/users" className="sidebar-link">
          <span className="material-icons-outlined">people</span>
          <span className="ml-3 text-base">Users</span>
        </Link>
      </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
