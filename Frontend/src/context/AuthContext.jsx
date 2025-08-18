import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode } from "jwt-decode";

// Create a React context for authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Holds user info: userId, username, role
  const [token, setToken] = useState(null);  // JWT token string

  // On app load, restore user info from stored JWT token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // decoded should include userId, username (sub), role if JWT is properly created
        setUser({
          userId: decoded.userId,
          username: decoded.sub,
          role: decoded.role,
        });
        
        setToken(storedToken);
      } catch (error) {
        // if token invalid, remove it
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Login function stores token and decodes user info
  const login = (jwt) => {
    try {
      
      const decoded = jwtDecode(jwt);
      
      setUser({
        userId: decoded.userId,
        username: decoded.sub,
        role: decoded.role,
      });
      setToken(jwt);
      localStorage.setItem("token", jwt);
    } catch (error) {
      alert("Invalid token");
    }
  };

  // Logout cleans up state and storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext anywhere
export const useAuth = () => {
  return useContext(AuthContext);
};
