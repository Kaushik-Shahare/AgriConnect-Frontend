"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSeedling, FaHandshake, FaShoppingBasket } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 py-20 overflow-hidden">
        {/* Animated Background Circles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="rounded-full bg-green-200 opacity-30 absolute w-[600px] h-[600px]"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="rounded-full bg-blue-200 opacity-20 absolute w-[400px] h-[400px]"
            animate={{ scale: [1, 1.05, 1], rotate: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-black drop-shadow-lg">
            Welcome to AgriConnect
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Empowering farmers, connecting communities, and bringing fresh produce directly to you.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            {isAuthenticated ? (
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link href="/signup">
                  <span className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 transition-all duration-300 cursor-pointer">
                    Sign Up
                  </span>
                </Link>
                <Link href="/signin">
                  <span className="px-8 py-3 bg-white text-green-700 border-2 border-green-600 rounded-full font-semibold text-lg shadow-lg hover:bg-green-50 transition-all duration-300 cursor-pointer">
                    Sign In
                  </span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-black"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why AgriConnect?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <FaSeedling size={48} className="text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Connect with Experts</h3>
            <p className="text-gray-800 text-center">
              Gain insights and advice from agricultural experts to improve your farming practices and boost productivity.
            </p>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <FaShoppingBasket size={48} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Sell Your Products</h3>
            <p className="text-gray-800 text-center">
              Access a digital marketplace to sell your crops and products directly to consumers, maximizing your profits.
            </p>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <FaHandshake size={48} className="text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Collaborate with Farmers</h3>
            <p className="text-gray-800 text-center">
              Build relationships with fellow farmers, collaborate on projects, and grow together as a community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 max-w-3xl mx-auto w-full">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-black text-center">Our Mission</h2>
          <p className="text-lg text-black text-center mb-2">
            AgriConnect is dedicated to empowering the agricultural community by providing a simple, efficient, and accessible platform for networking, knowledge sharing, and direct marketplace access.
          </p>
          <p className="text-lg text-black text-center">
            Join us in revolutionizing agriculture—one connection at a time.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 bg-gray-900 mt-auto">
        <p className="text-gray-200">&copy; {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
