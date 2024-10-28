import React, { useContext } from 'react';
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link className='navbar-link' to="/">
        <div className="navbar-logo">
          <img src="ayuda_logo.png" alt="logo" className="logo"/>
          <span>Ayuda</span>
        </div>
      </Link>
      <div className="navbar-links">
        <a href="/about">About</a>
        {isAuthenticated && (
          <Link onClick={handleLogout} className="navbar-logout">Logout</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
