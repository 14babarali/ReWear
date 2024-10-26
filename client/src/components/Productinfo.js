import React, { useState } from 'react';
import './stylesheets/Productinfo.css'; // CSS file for styling

const Productinfo = ({des}) => {
  const [activeSection, setActiveSection] = useState(null); // Track which section is open

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null); // Close the section if it's already open
    } else {
      setActiveSection(section); // Open the selected section
    }
  };

  return (
    <div className="info-section-container mb-2">
      <div className="info-item" onClick={() => toggleSection('description')}>
        <span className="info-label">Description</span>
        <span className="info-arrow">→</span>
      </div>
      {activeSection === 'description' && (
        <div className="info-content">
          <p>{des}</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('size')}>
        <span className="info-label">Size & Fit</span>
        <span className="info-arrow">→</span>
      </div>
      {activeSection === 'size' && (
        <div className="info-content">
          <p>This product runs true to size. Use our size chart to ensure the best fit.</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('shipping')}>
        <span className="info-label">Free Shipping & Returns</span>
        <span className="info-arrow">→</span>
      </div>
      {activeSection === 'shipping' && (
        <div className="info-content">
          <p>Free shipping on orders over $50. Easy returns within 30 days.</p>
        </div>
      )}

      <div className="info-item" onClick={() => toggleSection('reviews')}>
        <span className="info-label">Reviews (0)</span>
        <span className="info-arrow">→</span>
      </div>
      {activeSection === 'reviews' && (
        <div className="info-content">
          <p>No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
};

export default Productinfo;
