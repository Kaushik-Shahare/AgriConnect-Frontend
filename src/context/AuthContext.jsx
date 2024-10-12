"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of the Auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (newToken, newUserType, newUserId) => {
    setToken(newToken);
    setUsertype(newUserType);
    setUserId(newUserId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setUsertype(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    console.log("User ID:", userId);
    console.log("Logged in as", usertype);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Token:", token);
  }, [usertype, isAuthenticated, token]);

  return (
    <AuthContext.Provider
      value={{ token, usertype, userId, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
