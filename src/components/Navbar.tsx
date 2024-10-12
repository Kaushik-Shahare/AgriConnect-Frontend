// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">AgriConnect</div>
        <div className="flex space-x-4">
          {!isAuthenticated ? (
            <>
              <Link href="/signin" className="text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link href="/signup" className="text-gray-300 hover:text-white">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup" className="text-gray-300 hover:text-white">
                Home
              </Link>

              <button
                onClick={logout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
