"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import PostPage from "./components/MyPosts";
import { Settings } from "@mui/icons-material"; // Import icon separately if needed
import Loading from "@/components/Loading";

const DEFAULT_IMAGE_URL = "./images/default_profile.jpg"; // Replace with your default image URL

const ViewProfile = () => {
  const { token, usertype } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError("Failed to fetch profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading) return <Loading />;

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100 ">
      <div className="container mx-auto py-10">
        {/* Top section with profile image and user information */}
        <div className="bg-white shadow-main rounded-main p-6">
          <h1 className="text-2xl font-bold text-left text-black">My Profile</h1>
          <div className="flex justify-between items-center pb-6">
            <div className="flex items-center">
              <img
                src={profile?.profile_image || DEFAULT_IMAGE_URL}
                alt="Profile"
                className="w-36 h-36 rounded-full border border-gray-900"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-black">{profile?.name}</h2>
                <p className="text-gray-600">@{profile?.username}</p>
              </div>
            </div>
            {/* Edit Profile Button */}
            <button
              onClick={() => (window.location.href = "/profile/edit")}
              className="bg-gray-200 text-black rounded-full p-3 hover:bg-gray-300 transition"
              aria-label="Edit Profile"
            >
              <Settings />
            </button>
          </div>

          {/* Profile details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>Email: </strong> {profile?.email}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>Phone: </strong> {profile?.phone}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>Address: </strong> {profile?.address}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>City: </strong> {profile?.city}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>State: </strong> {profile?.state}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>Country: </strong> {profile?.country}
              </p>
            </div>
            <div className="col-span-1">
              <p className="font-medium text-gray-800">
                <strong>Zip Code: </strong> {profile?.zip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {usertype === "farmer" && (
        <div className="container mx-auto mt-10">
          <div className="bg-white shadow-md rounded-lg">
            <PostPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
