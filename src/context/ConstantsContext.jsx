"use client";

import React, { createContext, useContext } from "react";

// Define your constants here
const ConstantsContext = createContext();

const ConstantsProvider = ({ children }) => {
  const constants = {
    BACKEND_URL: "http://localhost:8000",
    // BACKEND_URL: "https://agri-connect-delta.vercel.app",

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
