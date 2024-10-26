import React from 'react';
import './stylesheets/navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCartShopping, faPersonDress, faMoneyBillWave, faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import logo from '../assests/rewear-logo-bg.png';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

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

      // Clear localStorage and update state
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      setUser(null);
      console.log('User Logged out Successfully');
      navigate('/logout');
    } catch (error) {
      let errorMsg = 'An unexpected error occurred.';
      if (error.response) {
        errorMsg = error.response.data.message;
        console.log(errorMsg);
        // Clear localStorage and update state
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/logout');
      } else if (error.request) {
        errorMsg = 'Network error. Please try again later.';
        console.log(errorMsg);
      }
    }
  };

  // const toggleCart = () => {
  //   setShowCart(!showCart);
  // };
  
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSellerClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.warning("Please login first.");
    }
  };

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt='ReWear-Brand-Logo' className="navbar-logo"/>
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
        <form className="d-flex mx-auto search-form">
          <FontAwesomeIcon icon={faSearch}/>
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        </form>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/seller" onClick={handleSellerClick} style={{ fontSize: '16px' }}>
                <FontAwesomeIcon icon={faMoneyBillWave}/> Seller</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tailor" onClick={handleSellerClick} style={{ fontSize: '16px' }}>
                <FontAwesomeIcon icon={faPersonDress}/> Tailor</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart" style={{ fontSize: '16px' }}>
                 <FontAwesomeIcon icon={faCartShopping} />
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav" style={{ fontSize: '16px' }}>
            {isLoggedIn ? (
              <>
              <li className="nav-item">
              <Link className="nav-link" to="/wishlist" style={{ fontSize: '16px' }}><FontAwesomeIcon icon={faHeart}/></Link>
            </li>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" aria-expanded="false">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown" style={{ right: 0 }}>
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                  <li><hr className="dropdown-divider" style={{color:"grey"}} /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
    <ToastContainer/>
    </>
  );
}

export default Navbar;