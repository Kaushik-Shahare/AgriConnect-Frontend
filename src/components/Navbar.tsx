"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Menu, MenuItem } from "@mui/material";
import SearchBar from "./SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const { isAuthenticated, profile_image, logout, usertype } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-main px-4 sm:px-10 py-2">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link href="/home" className="text-2xl font-bold text-black hover:text-primary transition-colors duration-200">
          AgriConnect
        </Link>
        <div className="flex-grow sm:w-1/3 ml-4 hidden md:block">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {!isAuthenticated ? (
            <>
              <Link href="/signin">
                <button className="px-4 py-2 bg-primary text-white rounded-main shadow hover:bg-primary-dark transition-all duration-200 focus-ring">Sign In</button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-secondary text-white rounded-main shadow hover:bg-secondary-dark transition-all duration-200 focus-ring">Sign Up</button>
              </Link>
            </>
          ) : (
            <>
              {usertype === "farmer" && (
                <Link href="/dashboard">
                  <button className="px-3 py-2 text-gray-700 hover:text-primary font-medium rounded focus-ring transition-colors">Dashboard</button>
                </Link>
              )}
              {usertype === "farmer" && (
                <Link href="/post">
                  <button className="px-3 py-2 text-gray-700 hover:text-primary font-medium rounded focus-ring transition-colors">Posts</button>
                </Link>
              )}
              <Link href="/cart">
                <button className="relative px-3 py-2 text-gray-700 hover:text-secondary rounded focus-ring transition-colors">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                </button>
              </Link>
              <Link href="/purchasehistory">
                <button className="px-3 py-2 text-gray-700 hover:text-primary font-medium rounded focus-ring transition-colors">My Orders</button>
              </Link>
              <button onClick={handleMenuClick} className="ml-2 focus-ring rounded-full border-2 border-primary hover:border-secondary transition-all">
                <img
                  src={profile_image || "https://res.cloudinary.com/dkfdmcxsz/image/upload/v1728890065/h8k9chejvd75xv2ms2dv.png"}
                  alt="profile"
                  className="rounded-full h-10 w-10 object-cover"
                />
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5 + 8,
                    width: "20ch",
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <Link href="/profile" className="block w-full text-gray-700 hover:text-primary transition-colors">My Profile</Link>
                </MenuItem>
                <MenuItem onClick={handleLogout} className="text-danger">Logout</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
      {/* Mobile SearchBar */}
      <div className="block md:hidden mt-2">
        <SearchBar />
      </div>
    </nav>
  );
}
