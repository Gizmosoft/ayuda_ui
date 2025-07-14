// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // State to hold user details

  // Check session storage for user authentication status on initial load
  useEffect(() => {
    console.log('AuthContext: Checking session storage...');
    const user = sessionStorage.getItem('user');
    if (user) {
      console.log('AuthContext: User found in session storage');
      setIsAuthenticated(true);
      setUser(JSON.parse(user));
    } else {
      console.log('AuthContext: No user in session storage');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
