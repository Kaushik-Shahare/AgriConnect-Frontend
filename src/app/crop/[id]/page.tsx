"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField, // Import TextField for quantity input
} from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { SellerDetailsCard } from "../components/SellerDetails";
import { OtherGoods } from "../components/OtherGoods";

interface CropDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  user: {
    email: string;
    id: number;
  };
}

export default function CropDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the crop ID from the URL
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1); // State for quantity input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to track error messages

  useEffect(() => {
    if (id) {
      // Fetch crop details by ID
      if (token == null) {
        return;
      }
      const fetchCropDetails = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/crop/details/${id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCrop(response.data);
        } catch (error) {
          console.error("Error fetching crop details:", error);
        }
      };
      fetchCropDetails();
    }
  }, [id, token]);

  if (!crop) {
    return <div>Loading...</div>;
  }

  const handlePurchase = async () => {
    if (token == null) {
      return;
    }
    setErrorMessage(null); // Reset any previous error messages
    if (purchaseQuantity > crop.quantity || purchaseQuantity <= 0) {
      setErrorMessage(
        "Invalid quantity selected. Please select a valid amount."
      );
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/crop/buy/${id}/`,
        { quantity_sold: purchaseQuantity, price_at_sale: crop.price }, // Send the selected quantity
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Purchase successful!");
      // router.push("/orders");
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Check for specific backend validation errors
        const { detail, code } = error.response.data;

        if (code === "own_crop_error") {
          setErrorMessage("You cannot buy your own crop.");
        } else if (code === "stock_error") {
          setErrorMessage(
            `Insufficient quantity in stock. Available quantity: ${crop.quantity} kg.`
          );
        } else if (code === "invalid_quantity") {
          setErrorMessage(
            "Invalid quantity. Quantity must be greater than zero."
          );
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An error occurred while processing the purchase.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <Container>
        <Card>
          <Grid container spacing={4}>
            {/* Left side: Image */}
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                alt={crop.name}
                height="400"
                image={crop.image || "/images/default-crop.jpeg"}
              />
            </Grid>
            {/* Right side: Details */}
            <Grid item xs={12} md={6}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {crop.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {crop.description}
                </Typography>
                <Typography variant="h6" color="primary" paragraph>
                  Price: ₹{crop.price} per kg
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Available Quantity: {crop.quantity} kg
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Seller: {crop.user.email}
                </Typography>

                {/* Conditional Rendering for Sold Out and Quantity Selector */}
                {crop.quantity === 0 ? (
                  <Typography variant="h6" color="error" paragraph>
                    Sold Out
                  </Typography>
                ) : (
                  <>
                    {/* Quantity Selector */}
                    <TextField
                      label="Select Quantity"
                      type="number"
                      value={purchaseQuantity}
                      onChange={(e) =>
                        setPurchaseQuantity(Number(e.target.value))
                      }
                      inputProps={{ min: 1, max: crop.quantity }}
                      fullWidth
                      margin="normal"
                    />

                    {/* Display Error Message */}
                    {errorMessage && (
                      <Typography color="error" variant="body2">
                        {errorMessage}
                      </Typography>
                    )}

                    {/* Buy Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handlePurchase}
                    >
                      Buy
                    </Button>
                  </>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Container>

      <Container className="pt-5">
        <SellerDetailsCard seller={crop.user} />
      </Container>

      <Container className="pt-5">
        <OtherGoods farmerId={crop.user.id} currentCropId={crop.id} />
      </Container>
    </div>
  );
}
