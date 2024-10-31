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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: "none", color: "white" }}>
              AgriConnect
            </Link>
          </Typography>
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
                <Link href="/home">
                  <Button color="inherit" sx={{ textTransform: "none" }}>
                    Home
                  </Button>
                </Link>
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
                  <Button color="inherit" sx={{ textTransform: "none" }}>
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
              </>
            )}
          </div>
        </Toolbar>
      </div>
    </AppBar>
  );
}
