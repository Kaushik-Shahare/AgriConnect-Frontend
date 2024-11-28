"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { CropCard } from "./components/CropCard";
import { Filters } from "./components/Filters";
import Loading from "@/components/Loading";

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

  const [query, setQuery] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Crop[]>([]);
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update the query state after the component mounts (client-side only)
  useEffect(() => {
    const queryParam = searchParams.get("query");
    setQuery(queryParam);
  }, [searchParams]);

  const fetchSearchResults = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/crop/search/`, {
        params: {
          query,
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          category: filters.category,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query, filters, token]); // Re-fetch results when query or filters change

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  return (
    <div className="flex flex-row min-h-screen py-2 bg-gray-100 pt-24">
      {/* Filter Div */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-6">
        <Filters onApplyFilters={(newFilters) => setFilters(newFilters)} />
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md p-10 ml-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Search Results
        </h1>
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : searchResults.length > 0 ? (
          <div className="flex flex-col gap-6">
            {searchResults.map((crop) => (
              <CropCard
                key={crop.id}
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
        ) : (
          <p className="text-center text-gray-600">No results found.</p>
        )}
      </div>
    </div>
  );
}
