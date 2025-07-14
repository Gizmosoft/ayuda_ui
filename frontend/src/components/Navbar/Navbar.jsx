import React, { useContext } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { removeUserFromSession } from '../../utils/SessionHandler.js';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src="/ayuda_logo.png" alt="Ayuda Logo" className="logo" />
          <span className="brand-text">Ayuda</span>
        </Link>
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn btn-outline-orange">
              Login
            </Link>
            <Link to="/signup" className="btn btn-orange">
              Sign Up
            </Link>
          </>
        ) : (
          <button className="btn btn-outline-orange" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
