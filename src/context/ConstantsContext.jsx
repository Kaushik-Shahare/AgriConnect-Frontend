"use client";

import React, { createContext, useContext } from "react";

// Define your constants here
const ConstantsContext = createContext();

const ConstantsProvider = ({ children }) => {
  const constants = {
    BACKEND_URL: "https://agriconnect-1ast.onrender.com",
    BACKEND_URL_1: "https://agriconnect-1ast.onrender.com",
    // BACKEND_URL_1: "https://api-agriconnect.kaushikshahare.com",

    // Add more constants as needed
  };

  return (
    <ConstantsContext.Provider value={constants}>
      {children}
    </ConstantsContext.Provider>
  );
};

// Custom hook to use the ConstantsContext
const useConstants = () => {
  const context = useContext(ConstantsContext);
  if (!context) {
    throw new Error("useConstants must be used within a ConstantsProvider");
  }
  return context;
};

export { ConstantsProvider, useConstants };
