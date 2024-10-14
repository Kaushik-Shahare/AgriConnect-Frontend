// pages/ViewProfile.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import PostPage from "./components/MyPosts";

const DEFAULT_IMAGE_URL = "./images/default_profile.jpg"; // Replace with your default image URL

const ViewProfile = () => {
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/account/profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Container component="main" maxWidth="md" className="py-10">
        <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
          {/* Top section with profile image and user information */}
          <Typography variant="h4" align="left" gutterBottom>
            My Profile
          </Typography>
          <div className="flex justify-between items-center pb-6">
            <div className="flex items-center">
              <img
                src={profile?.profile_image || DEFAULT_IMAGE_URL}
                alt="Profile"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                className="border border-gray-900"
              />
              <div className="ml-4">
                <Typography variant="h5" gutterBottom>
                  {profile?.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  @{profile?.username}
                </Typography>
              </div>
            </div>
            {/* Edit Profile Button */}
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/profile/edit")}
              sx={{
                backgroundColor: "lightgrey",
                color: "black",
                "&:hover": {
                  backgroundColor: "#777",
                },
                borderRadius: "50%",
                padding: "12px",
                minWidth: "auto",
              }}
            >
              {/* Edit Profile */}
              <Settings />
            </Button>
          </div>

          {/* Profile details */}
          <Grid container spacing={3} style={{ marginTop: "1rem" }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Email: </strong> {profile?.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Phone: </strong> {profile?.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Address: </strong> {profile?.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>City: </strong> {profile?.city}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>State: </strong> {profile?.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Country: </strong> {profile?.country}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Zip Code: </strong> {profile?.zip}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container component="main" maxWidth="md">
        <Paper elevation={3}>
          <PostPage />
        </Paper>
      </Container>
    </div>
  );
};

export default ViewProfile;
