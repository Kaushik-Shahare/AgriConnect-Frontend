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
  const { isAuthenticated, logout } = useAuth();
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
                  <Button color="inherit">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button color="inherit">Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/home">
                  <Button color="inherit">Home</Button>
                </Link>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  color="inherit"
                >
                  <MoreVertIcon />
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
