"use client";
import React, { useEffect, useState } from "react";

const Loading: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated Spinner */}
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-white border-solid"></div>

        {/* Loading Text with Typing Effect */}
        <p className="text-white text-lg font-semibold">Loading{dots}</p>
      </div>
    </div>
  );
};

export default Loading;
