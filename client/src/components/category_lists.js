// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/categories.css';

const categories = [
  {
    name: "Men's",
    subcategories: [
      { name: 'Event Dresses', category: 'men-eventdresses' },
      { name: 'Shirts', category: 'men-shirts' },
      { name: 'Pants', category: 'men-pants' },
      { name: 'Tailor Made', category: 'men-tailor' },
      { name: 'Shoes', category: 'men-shoes' },
    ],
  },
  {
    name: "Women's",
    subcategories: [
      { name: 'Event Dresses', category: 'women-event-dresses' },
      { name: 'Casual Dresses', category: 'women-casual-dresses' },
      { name: 'Tailor Made', category: 'women-tailor-collection' },
      { name: 'Shoes', category: 'women-shoes' },
    ],
  },
  {
    name: "kid's",
    subcategories: [
      { name: 'Event Dresses', category: 'children-event-dresses' },
      { name: 'Shirts', category: 'children-shirts-collection' },
      { name: 'Pants', category: 'children-pants-collection' },
      { name: 'Tailor Made', category: 'children-tailor-collection' },
      { name: 'Shoes', category: 'children-shoes-collection' },
    ],
  },
];

const Categorylists = () => {
  const [expanded, setExpanded] = useState({
    men: false,
    women: false,
    children: false,
  });
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const toggleCategory = (category) => {
    setExpanded((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuVisible((prevState) => !prevState);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark slim-navbar">
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuVisible ? "true" : "false"}
          aria-controls="navbarNav"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMobileMenuVisible ? 'show' : ''}`} id="navbarNav">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-9 d-flex">
                <ul className="nav me-auto">
                  {categories.map((category, index) => (
                    <li key={index} className="nav-item dropdown"
                      onMouseEnter={() => toggleCategory(category.name.toLowerCase())}
                      onMouseLeave={() => toggleCategory(category.name.toLowerCase())}>
                      <button className="btn btn-dark dropdown-toggle" type="button" id={`${category.name.toLowerCase()}Dropdown`} aria-expanded={expanded[category.name.toLowerCase()] ? "true" : "false"}>
                        {category.name}
                      </button>
                      {expanded[category.name.toLowerCase()] && (
                        <ul className="dropdown-menu bg-dark show" aria-labelledby={`${category.name.toLowerCase()}Dropdown`}>
                          {category.subcategories.map((subcategory, subindex) => (
                            <li key={subindex} className="dropdown-item subcategory-item">
                              <Link to={`/products/${subcategory.category}`}>{subcategory.name}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Categorylists;
