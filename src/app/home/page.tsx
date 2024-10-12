"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  styled, // Import styled from MUI
} from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";

// Styled Card component for hover effect
const HoverCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)", // Scale up on hover
    boxShadow: theme.shadows[6], // Increase shadow on hover
  },
}));

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

  useEffect(() => {
    // Fetch the crops from the backend
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/crop/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCrops(response.data); // Assume `setCrops` is a state handler for crops
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    fetchCrops();
  }, [token]); // Add token to dependency array if it comes from a state

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
              <HoverCard>
                <CardMedia
                  component="img"
                  alt={crop.name}
                  height="200"
                  image={crop.image || "/images/default-crop.jpeg"} // Use default image if crop image is not available
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {crop.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {crop.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Price: ₹{crop.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {crop.quantity} kg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seller: {crop.user.email}
                  </Typography>
                </CardContent>
                <Button variant="contained" color="primary" fullWidth>
                  Buy Now
                </Button>
              </HoverCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
