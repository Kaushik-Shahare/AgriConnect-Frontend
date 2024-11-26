"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { CropCard } from "./components/CropCard";
import { Filters } from "./components/Filters";

export default function SearchPage() {
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  interface Crop {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image_url: string;
    user: {
      email: string;
    };
  }

  const query = searchParams.get("query");
  const [searchResults, setSearchResults] = useState<Crop[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (!token) return;
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/crop/search/?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    fetchSearchResults();
  }, [token]);

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  return (
    <div className="flex flex-row min-h-screen py-2 bg-gray-100 pt-24">
      {/* Filter Div */}
      <Filters onApplyFilters={(filters) => setFilters(filters)} />
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Search Results
        </h1>
        <div className="space-y-4">
          {searchResults.map((crop) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
