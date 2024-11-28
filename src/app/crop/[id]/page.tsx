"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { SellerDetailsCard } from "../components/SellerDetails";
import { OtherGoods } from "../components/OtherGoods";
import Loading from "@/components/Loading";

interface CropDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url?: string;
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
  const [loading, setLoading] = useState(true);

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1); // State for quantity input
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to track error messages

  useEffect(() => {
    if (id) {
      // Fetch crop details by ID
      if (token == null) {
        return;
      }
      setLoading(true);
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
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return <Loading />;
  }

  if (!crop) {
    return <div className="text-center py-20">Loading...</div>;
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
      router.push("/purchasehistory");
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

  const handleAddToCart = async () => {
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
        `${BACKEND_URL}/api/cart/add-to-cart/`,
        { quantity: purchaseQuantity, crop: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/cart");
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Check for specific backend validation errors
        const { detail, code } = error.response.data;

        if (code === "own_crop_error") {
          setErrorMessage("You cannot add your own crop to the cart.");
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
        setErrorMessage("An error occurred while adding to the cart.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100 px-4 md:px-10 lg:px-40">
      <div className="container mx-auto p-4 bg-white rounded shadow-lg">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side: Image */}
          <div className="md:w-1/2">
            <img
              src={crop.image_url || "/images/default-crop.jpeg"}
              alt={crop.name}
              className="rounded-lg h-80 w-full object-cover mb-4 md:h-96"
            />
          </div>
          {/* Right side: Details */}
          <div className="md:w-1/2 p-4">
            <h2 className="text-2xl md:text-3xl font-bold">{crop.name}</h2>
            <p className="mt-2 text-gray-700">{crop.description}</p>
            <p className="mt-4 text-xl text-blue-600">
              Price: ₹{crop.price} per kg
            </p>
            <p className="mt-2 text-gray-500">
              Available Quantity: {crop.quantity} kg
            </p>
            <p className="mt-2 text-gray-500">Seller: {crop.user.email}</p>

            {/* Conditional Rendering for Sold Out and Quantity Selector */}
            {crop.quantity === 0 ? (
              <p className="mt-4 text-red-600 text-xl">Sold Out</p>
            ) : (
              <>
                {/* Quantity Selector */}
                <input
                  type="number"
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                  min="1"
                  max={crop.quantity}
                  className="mt-4 border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Select Quantity"
                />
                {/* Display Error Message */}
                {errorMessage && (
                  <p className="mt-2 text-red-600">{errorMessage}</p>
                )}
                {/* Buy Button */}
                <button
                  onClick={handlePurchase}
                  className="mt-4 bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
                >
                  Buy
                </button>
                <button
                  onClick={handleAddToCart}
                  className="mt-4 bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pt-5">
        <SellerDetailsCard seller={crop.user} />
      </div>

      <div className="pt-5">
        <OtherGoods farmerId={crop.user.id} currentCropId={crop.id} />
      </div>
    </div>
  );
}
