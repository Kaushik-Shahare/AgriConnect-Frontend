"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the Auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profile_image, setProfileImage] = useState(null);
  const router = useRouter();

  const login = (newToken, newUserType, newUserId, newProfileImage) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("usertype", newUserType);
    localStorage.setItem("userId", newUserId);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("profile_image", newProfileImage);
    setToken(newToken);
    setUsertype(newUserType);
    setUserId(newUserId);
    setIsAuthenticated(true);
    setProfileImage(newProfileImage);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("profile_image");
    setToken(null);
    setUsertype(null);
    setUserId(null);
    setIsAuthenticated(false);
    setProfileImage(null);
    router.push("/signin");
  };

  const updateProfileImage = (newProfileImage) => {
    localStorage.setItem("profile_image", newProfileImage);
    setProfileImage(newProfileImage);
  };

  // For debugging purposes

  // useEffect(() => {
  //   console.log("User ID:", userId);
  //   console.log("Logged in as", usertype);
  //   console.log("Is authenticated:", isAuthenticated);
  //   console.log("Token:", token);
  //   console.log("Profile Image:", profile_image);
  // }, [usertype, isAuthenticated, token]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usertype = localStorage.getItem("usertype");
    const userId = localStorage.getItem("userId");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const profile_image = localStorage.getItem("profile_image");

    if (token && usertype && userId && isAuthenticated && profile_image) {
      login(token, usertype, userId, profile_image);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        usertype,
        userId,
        isAuthenticated,
        profile_image,
        updateProfileImage,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
