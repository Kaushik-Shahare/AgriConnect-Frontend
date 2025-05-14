"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loading: React.FC = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated Spinner with Glow */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: [0.7, 1, 0.9, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute rounded-full h-28 w-28 bg-gradient-to-tr from-green-300 via-blue-400 to-purple-400 blur-2xl opacity-60"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
          <svg className="h-20 w-20 z-10" viewBox="0 0 50 50">
            <motion.circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="6"
              strokeDasharray="90 60"
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="0.5" stopColor="#60a5fa" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        {/* Animated Loading Text */}
        <motion.p
          className="text-2xl font-bold text-gray-800 tracking-wide"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          Loading{dots}
        </motion.p>
      </div>
    </div>
  );
};

export default Loading;
