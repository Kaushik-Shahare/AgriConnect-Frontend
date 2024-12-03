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
  Box,
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
    <AppBar position="fixed" sx={{ backgroundColor: "#2d3748" }}>
      <div className="px-4 sm:px-20">
        <Toolbar>
          <div className="flex justify-between w-full items-center">
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              <Link
                href="/home"
                style={{ textDecoration: "none", color: "white" }}
              >
                AgriConnect
              </Link>
            </Typography>
            <div className="flex-grow sm:w-1/3 ml-4">
              <SearchBar />
            </div>
            <Box>
              {!isAuthenticated ? (
                <>
                  <Link href="/signin">
                    <Button
                      color="inherit"
                      sx={{ textTransform: "none", margin: 1 }}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      color="inherit"
                      sx={{ textTransform: "none", margin: 1 }}
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
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
                    <Link href="/cart">
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        className="text-xl text-white"
                      />
                    </Link>
                    <Link href="/purchasehistory">
                      <Button color="inherit" sx={{ textTransform: "none" }}>
                        My Orders
                      </Button>
                    </Link>
                    <IconButton
                      onClick={handleMenuClick}
                      color="inherit"
                      sx={{
                        borderRadius: "50%",
                        "&:hover": { backgroundColor: "#4A5568" },
                      }}
                    >
                      <img
                        src={
                          profile_image ||
                          "https://res.cloudinary.com/dkfdmcxsz/image/upload/v1728890065/h8k9chejvd75xv2ms2dv.png"
                        }
                        alt="profile"
                        className="rounded-full h-10 w-10 border-2 border-white"
                      />
                    </IconButton>
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
            </Box>
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
}
