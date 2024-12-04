"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { CropCard } from "./CropCard";
import { Filters } from "./Filters";
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
    average_rating: number;
    number_of_ratings: number;
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
  const [previous, setPrevious] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    const queryParam = searchParams.get("query");
    setQuery(queryParam);
  }, [searchParams]);

  const fetchSearchResults = async (url?: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const params: { [key: string]: any } = {};

    if (!url) {
      // Include query only if it's not empty
      if (query) {
        params.query = query;
      }

      // Include filters only if they are set
      if (filters.minPrice) {
        params.min_price = filters.minPrice;
      }

      if (filters.maxPrice) {
        params.max_price = filters.maxPrice;
      }

      if (filters.category) {
        params.category = filters.category;
      }
    }

    try {
      const response = await axios.get(
        url || `${BACKEND_URL}/api/crop/search/`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data.results);
      setPrevious(response.data.previous);
      setNext(response.data.next);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error("Error fetching search results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query, filters, token]);

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  const handleApplyFilters = (newFilters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) => {
    setFilters(newFilters);
  };

  const handlePagination = (url: string | null) => {
    if (url) {
      fetchSearchResults(url);
    }
  };

  return (
    <div className="flex flex-row min-h-screen py-2 bg-gray-100 pt-24">
      {/* Filter Div */}
      <div className="w-1/4 bg-white shadow-md rounded-lg p-6">
        <Filters onApplyFilters={handleApplyFilters} />
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
          <div>
            <div className="flex flex-col gap-6">
              {searchResults.map((crop) => (
                <CropCard
                  key={crop.id}
                  id={crop.id}
                  name={crop.name}
                  description={crop.description}
                  price={crop.price}
                  quantity={crop.quantity}
                  average_rating={crop.average_rating}
                  number_of_ratings={crop.number_of_ratings}
                  onClick={() => handleCardClick(crop.id)}
                  sellerEmail={crop.user.email}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
              <button
                disabled={!previous}
                onClick={() => handlePagination(previous)}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  !previous
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <button
                disabled={!next}
                onClick={() => handlePagination(next)}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  !next ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No results found.</p>
        )}
      </div>
    </div>
  );
}
