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

  const groupedCrops = crops.reduce((acc, crop) => {
    if (!acc[crop.category]) {
      acc[crop.category] = [];
    }
    acc[crop.category].push(crop);
    return acc;
  }, {} as { [key: string]: Crop[] });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen py-10 bg-gray-100">
      <AIChatAssistant />
      <div className="flex flex-col gap-4 container mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="flex flex-row gap-8 border justify-center border-black rounded-lg shadow-lg p-4 h-40 w-full ">
          <div className="flex flex-col justify-between items-center">
            <div className="border border-black rounded-full p-1 h-28 w-28 overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-full"
                src="/images/keto.jpeg"
                alt="food"
              />
            </div>
            <p>Keto</p>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="border border-black rounded-full p-1 h-28 w-28 overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-full"
                src="/images/Mediterranean.jpeg"
                alt="food"
              />
            </div>
            <p>Mediterranean</p>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="border border-black rounded-full p-1 h-28 w-28 overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-full"
                src="/images/vegan.jpeg"
                alt="food"
              />
            </div>
            <p>Vegan</p>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="border border-black rounded-full p-1 h-28 w-28 overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-full"
                src="/images/vegetarian.jpeg"
                alt="food"
              />
            </div>
            <p>Vegetarian</p>
          </div>
          <div className="flex flex-col justify-between items-center">
            <div className="border border-black rounded-full p-1 h-28 w-28 overflow-hidden">
              <img
                className="h-full w-full object-cover rounded-full"
                src="/images/low-carb.jpeg"
                alt="food"
              />
            </div>
            <p>Low-Carb</p>
          </div>
        </div>

        {/* eye catching section */}
        <div className="flex flex-row gap-8 border justify-center border-black rounded-lg shadow-lg  h-60 w-full overflow-hidden">
          <Carousel />
        </div>

        {/* Render crops category */}
        <div className="flex flex-row gap-8">
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            <div className="relative border border-black rounded-lg shadow-lg p-2 h-40 w-56">
              <img
                src="/images/veg.jpeg"
                alt="food"
                className="h-full w-full object-cover rounded-lg"
              />
              <p className="absolute">Vegetable</p>
            </div>
            <div className="border border-black rounded-lg shadow-lg p-2 h-40 w-56">
              <img
                src="/images/non-veg 2.jpeg"
                alt="food"
                className="h-full w-full object-cover rounded-lg"
              />
              <p>Non-Veg</p>
            </div>
            <div className="border border-black rounded-lg shadow-lg p-2 h-40 w-56">
              <img
                src="/images/dairy 2.jpeg"
                alt="food"
                className="h-full w-full object-cover rounded-lg"
              />
              <p>Dairy</p>
            </div>
            <div className="border border-black rounded-lg shadow-lg p-2 h-40 w-56">
              <img
                src="/images/cereals 2.jpeg"
                alt="food"
                className="h-full w-full object-cover rounded-lg"
              />
              <p>Cereals</p>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            {crops.slice(0, 3).map((crop) => (
              <div
                key={crop.id}
                className="border border-black rounded-lg shadow-lg p-4 w-80"
              >
                <CropCard
                  id={crop.id}
                  name={crop.name}
                  description={crop.description}
                  price={crop.price}
                  quantity={crop.quantity}
                  image_url={crop.image_url}
                  sellerEmail={crop.user.email}
                  onClick={() => handleCardClick(crop.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
