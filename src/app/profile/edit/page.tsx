"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import { CircularProgress, Snackbar } from "@mui/material"; // Import CircularProgress and Snackbar from MUI for loading and notifications
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { LinearProgress } from "@mui/material"; // Import LinearProgress for the timer bar

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProfile = () => {
  const { token, updateProfileImage } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [snackbarTimer, setSnackbarTimer] = useState<NodeJS.Timeout | null>(
    null
  ); // Timer for snackbar
  const router = useRouter();

  const [progress, setProgress] = useState(100); // Progress bar for success message

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

    if (newProfileImage) {
      formData.append("new_profile_image", newProfileImage);
    }

    for (const key in profile) {
      formData.append(key, profile[key]);
    }
    formData.delete("profile_image");

    try {
      await axios
        .put(`${BACKEND_URL}/api/account/profile/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          updateProfileImage(response.data.profile_image);
        });
      setSuccess(true);
      setError(null);

      // Start timer for 6 seconds and then redirect to profile page
      setSnackbarTimer(
        setTimeout(() => {
          router.push("/profile");
        }, 6000)
      );

      // Progress bar decrease
      let decrementProgress = 100;
      const intervalId = setInterval(() => {
        decrementProgress -= 100 / 60; // Decrease progress over 6 seconds (100 / 60 = 1.67 every 100ms)
        setProgress(decrementProgress);
        if (decrementProgress <= 0) {
          clearInterval(intervalId);
        }
      }, 100);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile");
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    if (snackbarTimer) {
      clearTimeout(snackbarTimer);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100 pt-20">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>

        <div className="flex flex-col items-center mb-4">
          <img
            src={profile?.profile_image || DEFAULT_IMAGE_URL}
            alt="Profile"
            className="w-32 h-32 rounded-full border border-gray-300 object-cover mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 rounded p-2 mb-4"
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              value={profile?.email}
              disabled
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile?.username}
              disabled
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile?.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profile?.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profile?.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="city">
              City
            </label>
            <input
              type="text"
              name="city"
              value={profile?.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="state">
              State
            </label>
            <input
              type="text"
              name="state"
              value={profile?.state}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={profile?.country}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="zip">
              Zip Code
            </label>
            <input
              type="text"
              name="zip"
              value={profile?.zip}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            Update Profile
          </button>
        </form>
      </div>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} onClose={handleClose}>
        <div>
          <Alert onClose={handleClose} severity="success">
            Profile updated successfully!
          </Alert>
          <LinearProgress
            variant="determinate"
            value={progress} // Show full progress initially
            style={{
              height: "4px",
              transition: "width 6s linear",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        </div>
      </Snackbar>
    </div>
  );
};

export default UserProfile;
