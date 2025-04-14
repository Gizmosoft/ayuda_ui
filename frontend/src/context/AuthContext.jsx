// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // State to hold user details

  // Check session storage for user authentication status on initial load
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
