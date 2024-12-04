"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CropCard } from "./components/CropCard";
import Carousel from "./components/Carousel";
import AIChatAssistant from "@/components/AIChatAssistant";
import Loading from "@/components/Loading";

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
    image_url?: string;
    average_rating?: number;
    number_of_ratings?: number;
  }

  const [crops, setCrops] = useState<Crop[]>([]);
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
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
    setLoading(false);
  }, [token]);

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-green-50">
      <AIChatAssistant />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-16">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to AgriConnect
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Connecting Farmers, Experts, and Buyers for a Sustainable Future
          </p>
          <button className="bg-white text-green-500 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100">
            Explore Crops
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "Cereals", image: "/images/cereals 2.jpeg" },
            { name: "Dairy", image: "/images/dairy 2.jpeg" },
            { name: "Vegetarien", image: "/images/vegetarian.jpeg" },
            { name: "Non-Vegetarian", image: "/images/home-banner2.jpeg" },
            { name: "Fruits", image: "/images/fruits.jpeg" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex flex-col items-center gap-2 hover:scale-105 transform transition duration-300"
            >
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-full shadow-lg overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <p className="text-sm md:text-base font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-6 mx-6" />

      {/* Carousel Section */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Explore Our Marketplace</h2>
        <div className="rounded-lg shadow-lg overflow-hidden">
          <Carousel />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-6 mx-6" />

      {/* Featured Crops */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Crops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.slice(0, 3).map((crop) => (
            <div
              key={crop.id}
              className="rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
            >
              <CropCard
                id={crop.id}
                name={crop.name}
                description={crop.description}
                price={crop.price}
                quantity={crop.quantity}
                image_url={crop.image_url}
                sellerEmail={crop.user.email}
                average_rating={crop.average_rating ?? 0}
                number_of_ratings={crop.number_of_ratings ?? 0}
                onClick={() => handleCardClick(crop.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
