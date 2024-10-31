"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
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

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  const groupedCrops = crops.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = [];
    }
    acc[crop.category].push(crop);
    return acc;
  }, {} as { [key: string]: Crop[] });

  return (
    <div className="flex flex-col min-h-screen py-10 bg-gray-100">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Farmer Goods Available for Sale
        </h1>

        {/* Render crops by category */}
        {Object.keys(groupedCrops).map((category) => (
          <div
            key={category}
            className="border border-gray-300 rounded-lg shadow-sm p-6 mb-8 bg-white"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 underline">
              {category}
            </h2>

            {/* Horizontal Scrollable Grid for Crops */}
            <div className="flex overflow-x-auto space-x-4 py-4">
              {groupedCrops[category].map((crop) => (
                <div
                  key={crop.id}
                  className="flex-none w-1/5"
                  onClick={() => handleCardClick(crop.id)}
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
