import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './SellerSidebar.css'; // Import the CSS file

const SellerSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar w-auto ${isOpen ? 'open' : ''}`}>
      <div className='d-flex' style={{flexDirection: 'column'}}>
      {/* Sidebar Header */}
      <div className="sidebar-header p-2">
          <span className='text-base'>
          <h3 className='m-0'><strong>ReWear</strong></h3>
          </span>
          <button className="sidebar-close-btn p-0" onClick={toggleSidebar}>
          <span className="material-icons-outlined text-2xl"><strong>close</strong></span>
        </button>
        </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav mt-3">
        <Link to="/seller/Dashboard" className="sidebar-link">
          <span className="material-icons-outlined">dashboard</span>
          <span className="ml-3 text-base">Dashboard</span>
        </Link>
        <Link to="/seller/catalogue" className="sidebar-link">
          <span className="material-icons-outlined">category</span>
          <span className="ml-3 text-base">Catalogue</span>
        </Link>
        <Link to="/seller/Orders" className="sidebar-link">
          <span className="material-icons-outlined">shopping_cart</span>
          <span className="ml-3 text-base">Orders</span>
        </Link>
        <Link to="/seller/Product" className="sidebar-link">
          <span className="material-icons-outlined">inventory_2</span>
          <span className="ml-3 text-base">Products</span>
        </Link>
        <Link to="/seller/reviews" className="sidebar-link">
          <span className="material-icons-outlined">analytics</span>
          <span className="ml-3 text-base">Reviews</span>
        </Link>
        <Link to="/seller/messages" className="sidebar-link">
          <span className="material-icons-outlined">message</span>
          <span className="ml-3 text-base">Messages</span>
        </Link>
        <Link to="/seller/users" className="sidebar-link">
          <span className="material-icons-outlined">report</span>
          <span className="ml-3 text-base">Complaints</span>
        </Link>
      </nav>
      </div>
    </aside>
  );
};

export default SellerSidebar;
