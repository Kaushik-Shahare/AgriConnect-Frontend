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
    localStorage.setItem("token", newToken);
    localStorage.setItem("usertype", newUserType);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem("isAuthenticated", true);
    setToken(newToken);
    setUsertype(newUserType);
    setUserId(newUserId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usertype = localStorage.getItem("usertype");
    const userId = localStorage.getItem("userId");
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (token && usertype && userId && isAuthenticated) {
      login(token, usertype, userId);
    }
  });

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
