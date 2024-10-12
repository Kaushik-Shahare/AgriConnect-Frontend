"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function SignUp() {
  const { BACKEND_URL } = useConstants();
  //   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize useRouter for redirection
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/api/account/login/`, {
        email,
        password,
      });

      const { token, user } = response.data;
      login(token.access, user.user_type, user.id);

      router.push("/home"); // Redirect user to login page

      // Handle successful signup, e.g., redirect to the homepage or show a success message
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}{" "}
        {/* Display error message */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* <TextField
            id="name"
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded"
          /> */}

          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded"
          />

          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
