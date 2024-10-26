import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {getBuyerCategories} from '../utility/seller/categoryApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faHeart, faSearch, faBars, faFilter } from '@fortawesome/free-solid-svg-icons';
// import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/navbar.css';
import './stylesheets/categories.css';
import logo from '../assests/rewear-logo.png';

const AppHeader = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownbtnRef = useRef(null);

  const [expanded, setExpanded] = useState({});
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [categories, setCategories] = useState([]);
  const [noCategoriesMessage, setNoCategoriesMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const data = await getBuyerCategories(token);
      const organizedCategories = organizeCategories(data); // Organize categories as needed

      setCategories(organizedCategories); // Update state with the organized categories
      
      // Store categories in localStorage after organizing and stringifying them
      localStorage.setItem('categories', JSON.stringify(organizedCategories));
      if (data.length === 0) {
        setNoCategoriesMessage('No categories found. Please add a new category.');
      } else {
        setNoCategoriesMessage('');
      }
    };
    fetchCategories();
  }, []);

  const organizeCategories = (flatCategories) => {
    const categoryMap = {};
    const roots = [];

    flatCategories.forEach((category) => {
      categoryMap[category._id] = { ...category, children: [] };
    });

    flatCategories.forEach((category) => {
      if (category.parent) {
        categoryMap[category.parent]?.children.push(categoryMap[category._id]);
      } else {
        roots.push(categoryMap[category._id]);
      }
    });

    return roots;
  };

  
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleProfileBlur = (e) => {
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      return; // If focus is still within the language menu, do nothing
    }
    setIsDropdownOpen(false);
  }
   // Close dropdown when clicking outside
   useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  
  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:3001/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem('user');
      localStorage.removeItem('token');

      console.log('User Logged out Successfully');
      navigate('/logout');
    } catch (error) {
      let errorMsg = 'An unexpected error occurred.';
      if (error.response) {
        errorMsg = error.response.data.message;
        console.log(errorMsg);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/logout');
      } else if (error.request) {
        errorMsg = 'Network error. Please try again later.';
        console.log(errorMsg);
      }
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const toggleCategory = (categoryId) => {
    setExpanded((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuVisible((prevState) => !prevState);
  };

  return (
    <>
      <nav className="bg-white shadow-lg p-4 top-0 w-full">
      <div className="grid-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="ReWear-Brand-Logo" className="logo" style={{ height: '80px' }} />
          </Link>
        </div>

        <div className="category-container ">
            {noCategoriesMessage && <p>{noCategoriesMessage}</p>}
            {categories.map((category) => (
              <div key={category._id} className="category-group">
                <button className="category-button" onClick={() => toggleCategory(category._id)}>
                  {category.name}
                </button>
                {expanded[category._id] && (
                  <div className="dropdown-menu">
                    {category.children.map((child) => (
                      <div key={child._id}>
                        <button className="subcategory-button" onClick={() => toggleCategory(child._id)}>
                          {child.name}
                        </button>
                        {expanded[child._id] && (
                          <div className="subdropdown-menu">
                            {child.children.map((subchild) => (
                              <Link 
                                key={subchild._id} 
                                to={`/buyer/products/${subchild.slug}`}
                                state={{ categoryId: subchild._id }}
                                className="dropdown-item">
                                  {subchild.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>


          {/* Desktop Links */}
          <div className="link-container">
          <div className="hidden lg:flex items-center space-x-6">
            {/* Search Bar */}
            {searchVisible && (
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                />
                <button className="search-button"><FontAwesomeIcon icon={faFilter}/></button>
              </div>
            )}
            <button className="search-btn text-gray-700 hover:text-current" onClick={handleSearchToggle}>
              <FontAwesomeIcon icon={faSearch} />
            </button>

            {/* Cart Icon */}
            <Link to="/buyer/cart" className="text-gray-700 hover:text-current">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>

            {/* Wishlist, User Profile, and Logout Dropdown */}
            {isLoggedIn ? (
              <>
                <Link to="/buyer/wishlist" className="text-gray-700 hover:text-current">
                  <FontAwesomeIcon icon={faHeart} />
                </Link>
                <div className="relative">
                  <button 
                    ref={dropdownbtnRef}
                    className="search-btn flex items-center text-gray-700 hover:text-current" 
                    onClick={toggleDropdown} 
                    onBlur={handleProfileBlur}>
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                  {isDropdownOpen && (
                    <div ref={dropdownRef}>
                    <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                      <li>
                        <Link className="block px-4 py-2 text-gray-700" to="/buyer/profile">Profile</Link>
                      </li>
                      <li>
                        <Link className="block px-4 py-2 text-gray-700" to="/buyer/buyers_orders">Orders</Link>
                      </li>
                      {/* <li>
                        <hr className="border-t border-gray-300" />
                      </li> */}
                      <li>
                        <button className="logout-btn block text-left px-4 py-2 text-gray-700 " onClick={handleLogout}>Logout</button>
                      </li>
                    </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
             <Link className="text-gray-700 no-underline" to="/login">Login</Link>
<Link className="text-gray-700 no-underline ml-4" to="/register">Register</Link>

              </>
            )}
          </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-gray-700" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMobileMenuVisible ? 'block' : 'hidden'}`}>
        <div className="bg-gray-800 text-white p-4 space-y-2">
        {noCategoriesMessage && <p>{noCategoriesMessage}</p>}
          {categories.map((category, index) => (
            <div key={index}>
              <button
                className="w-full text-left font-semibold"
                onClick={() => toggleCategory(category.name.toLowerCase())}
              >
                {category.name}
              </button>
              {expanded[category.name.toLowerCase()] && (
                <ul className="pl-4">
                  {category.subcategories.map((subcategory, subindex) => (
                    <li key={subindex}>
                      <Link className="block py-1" to={`/buyer/products/${subcategory.category}`}>
                        {subcategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppHeader;