import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './TailorSidebar.css'; // Import the CSS file
import { useTranslation } from 'react-i18next';


const TailorSidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className='d-flex' style={{flexDirection: 'column'}}>
        {/* Sidebar Header */}
        <div className="sidebar-header p-2">
          <span className='text-base'>
            <h3 className='m-0'><strong>{t('ReWear')}</strong></h3>
          </span>
          <button className="sidebar-close-btn p-0" onClick={toggleSidebar}>
            <span className="material-icons-outlined text-2xl"><strong>close</strong></span>
           </button>
        </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav mt-3 p-0">
        <Link to="/tailor/" className="sidebar-link">
          <span className="material-icons-outlined">dashboard</span>
          <span className="ml-3 text-base">{t('dashboard')}</span>
        </Link>
        <Link to="/tailor/orders" className="sidebar-link">
          <span className="material-icons-outlined">shopping_cart</span>
          <span className="ml-3 text-base">{t('orders')}</span>
        </Link>
        <Link to="/tailor/catalogue" className="sidebar-link">
          <span className="material-icons-outlined">inventory_2</span>
          <span className="ml-3 text-base">{t('products')}</span>
        </Link>
        <Link to="/tailor/Gigs" className="sidebar-link">
          <span className="material-icons-outlined">analytics</span>
          <span className="ml-3 text-base">{t('gig')}</span>
        </Link>
        <Link to="/tailor/view" className="sidebar-link">
          <span className="material-icons-outlined">message</span>
          <span className="ml-3 text-base">{t('messages')}</span>
        </Link>
        <Link to="/tailor/reviews" className="sidebar-link">
          <span className="material-icons-outlined">reviews</span>
          <span className="ml-3 text-base">{t('reviews')}</span>
        </Link>
      
      </nav>

      </div>
    </aside>
  );
};

export default TailorSidebar;
