"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  TextField,
} from "@mui/material";
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
    <AppBar position="fixed" sx={{ backgroundColor: "#1f2937" }}>
      <div className="px-20">
        <Toolbar>
          <div className="flex flex-row justify-between w-full">
            <Typography variant="h6" component="div">
              <Link
                href="/home"
                style={{ textDecoration: "none", color: "white" }}
              >
                AgriConnect
              </Link>
            </Typography>
            <div className="w-3/4">
              <SearchBar />
            </div>
            <div>
              {!isAuthenticated ? (
                <>
                  <Link href="/signin">
                    <Button color="inherit" sx={{ textTransform: "none" }}>
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button color="inherit" sx={{ textTransform: "none" }}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex flex-row">
                    {usertype === "buyer" && (
                      <Link href="/cart">
                        <FontAwesomeIcon
                          icon={faShoppingCart}
                          className="text-2xl text-white p-2"
                        />
                      </Link>
                    )}
                    {usertype === "farmer" && (
                      <Link href="/dashboard">
                        <Button color="inherit" sx={{ textTransform: "none" }}>
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    {usertype === "farmer" && (
                      <Link href="/post">
                        <Button color="inherit" sx={{ textTransform: "none" }}>
                          Posts
                        </Button>
                      </Link>
                    )}
                    <Link href="/purchasehistory">
                      <Button
                        className="px-2"
                        color="inherit"
                        sx={{ textTransform: "none" }}
                      >
                        My Orders
                      </Button>
                    </Link>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleMenuClick}
                      color="inherit"
                    >
                      {/* <MoreVertIcon /> */}
                      <img
                        src={
                          profile_image ||
                          "https://res.cloudinary.com/dkfdmcxsz/image/upload/v1728890065/h8k9chejvd75xv2ms2dv.png"
                        }
                        alt="profile"
                        className="rounded-full h-8 w-8 border border-white"
                      />
                    </IconButton>
                    <Menu
                      id="long-menu"
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
                        <Link
                          href="/profile"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          My Profile
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
                </>
              )}
            </div>
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
}
