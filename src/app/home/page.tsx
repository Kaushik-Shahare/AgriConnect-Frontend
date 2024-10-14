"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Box } from "@mui/material";
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
    category: string;
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
    if (!token) return;
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

  // Group crops by category
  const groupedCrops = crops.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = [];
    }
    acc[crop.category].push(crop);
    return acc;
  }, {} as { [key: string]: Crop[] });

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

        {/* Render crops by category */}
        {Object.keys(groupedCrops).map((category) => (
          <div
            key={category} // Add key here for the category div
            className="border-2 border-gray-400 px-8 py-4 my-4 rounded-lg shadow-md bg-white"
          >
            <div className="mb-12">
              <Typography variant="h4" gutterBottom className="text-black">
                {category}
              </Typography>

              {/* Horizontal Scrollable Grid for Crops */}
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  paddingBottom: "1rem",
                }}
              >
                {groupedCrops[category].map((crop) => (
                  <Box
                    key={crop.id} // Ensure each CropCard has a unique key
                    sx={{
                      flex: "0 0 18%", // Adjust card width (10-20%)
                      marginRight: "10px", // Adjust spacing between cards
                    }}
                  >
                    <CropCard
                      id={crop.id}
                      name={crop.name}
                      description={crop.description}
                      price={crop.price}
                      quantity={crop.quantity}
                      image={crop.image}
                      sellerEmail={crop.user.email}
                      onClick={() => handleCardClick(crop.id)}
                    />
                  </Box>
                ))}
              </Box>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
