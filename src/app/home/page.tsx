"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Typography } from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CropCard } from "./components/CropCard"; // Import CropCard

export default function HomePage() {
  interface Crop {
    id: number;
    user: {
      email: string;
    };
    name: string;
    description: string;
    price: number;
    quantity: number;
    image?: string;
  }

  const [crops, setCrops] = useState<Crop[]>([]);
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Fetch the crops from the backend
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/crop/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCrops(response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    fetchCrops();
  }, [token]);

  // Function to handle card click and navigate to detailed page
  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  return (
    <div className="flex flex-col min-h-screen py-2 bg-gray-100">
      <Container className="py-20">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          className="text-black"
        >
          Farmer Goods Available for Sale
        </Typography>
        <Grid container spacing={4}>
          {crops.map((crop) => (
            <Grid item xs={12} sm={6} md={4} key={crop.id}>
              <CropCard
                id={crop.id}
                name={crop.name}
                description={crop.description}
                price={crop.price}
                quantity={crop.quantity}
                image={crop.image}
                sellerEmail={crop.user.email}
                onClick={handleCardClick}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
