"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProfile = () => {
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  // Default profile image URL
  const DEFAULT_IMAGE_URL = "./images/default_profile.jpg"; // Replace with your default image URL

  useEffect(() => {
    if (token === null) return;
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
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append profile image if a new one exists
    if (newProfileImage) {
      formData.append("new_profile_image", newProfileImage);
    }

    // Append other profile data
    for (const key in profile) {
      formData.append(key, profile[key]);
    }
    formData.delete("profile_image");

    try {
      await axios.put(`${BACKEND_URL}/api/account/profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile");
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
          <Typography variant="h4" align="center" gutterBottom>
            User Profile
          </Typography>

          <div className="flex flex-col items-center pb-6">
            <img
              src={profile?.profile_image || DEFAULT_IMAGE_URL}
              alt="Profile"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              className="border border-gray-900"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "1rem" }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={profile?.email}
                  disabled
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Username"
                  name="username"
                  value={profile?.username}
                  disabled
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={profile?.name}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={profile?.phone}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  value={profile?.address}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="City"
                  name="city"
                  value={profile?.city}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="State"
                  name="state"
                  value={profile?.state}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Country"
                  name="country"
                  value={profile?.country}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Zip Code"
                  name="zip"
                  value={profile?.zip}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "1rem" }}
            >
              Update Profile
            </Button>
          </form>
        </Paper>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default UserProfile;
