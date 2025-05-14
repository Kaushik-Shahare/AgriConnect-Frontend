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
  const [showFilters, setShowFilters] = useState(false);
  const [cartErrors, setCartErrors] = useState<{ [cropId: number]: string | null }>({});

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

  const handleAddToCart = async (crop: Crop) => {
    if (!token) return;
    setCartErrors((prev) => ({ ...prev, [crop.id]: null }));
    const quantity = 1; // Always add 1 by default
    if (quantity > crop.quantity || quantity <= 0) {
      setCartErrors((prev) => ({ ...prev, [crop.id]: "Invalid quantity selected. Please select a valid amount." }));
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/api/cart/add-to-cart/`,
        { quantity, crop: crop.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/cart");
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { code } = error.response.data;
        if (code === "own_crop_error") {
          setCartErrors((prev) => ({ ...prev, [crop.id]: "You cannot add your own crop to the cart." }));
        } else if (code === "stock_error") {
          setCartErrors((prev) => ({ ...prev, [crop.id]: `Insufficient quantity in stock. Available quantity: ${crop.quantity} kg.` }));
        } else if (code === "invalid_quantity") {
          setCartErrors((prev) => ({ ...prev, [crop.id]: "Invalid quantity. Quantity must be greater than zero." }));
        } else {
          setCartErrors((prev) => ({ ...prev, [crop.id]: "An unexpected error occurred. Please try again." }));
        }
      } else {
        setCartErrors((prev) => ({ ...prev, [crop.id]: "An error occurred while adding to the cart." }));
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen py-2 bg-gray-100 pt-24">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex justify-end px-4 mb-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded-main shadow hover:bg-primary-dark transition"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
      {/* Filter Div */}
      <div className={`w-full md:w-1/4 bg-white shadow-main rounded-main p-6 mb-4 md:mb-0 ${showFilters ? '' : 'hidden md:block'}`}> 
        <Filters onApplyFilters={handleApplyFilters} />
      </div>

      <div className="flex-1 bg-white rounded-main shadow-main p-6 md:ml-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Search Results
        </h1>
        {loading ? (
          <Loading />
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : searchResults.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((crop) => (
                <div key={crop.id} className="rounded-main shadow-main overflow-hidden border border-gray-200 hover:shadow-xl transition bg-white flex flex-col">
                  <CropCard
                    id={crop.id}
                    name={crop.name}
                    description={crop.description}
                    price={crop.price}
                    quantity={crop.quantity}
                    average_rating={crop.average_rating}
                    number_of_ratings={crop.number_of_ratings}
                    onClick={() => handleCardClick(crop.id)}
                    sellerEmail={crop.user.email}
                    image_url={crop.image_url}
                  />
                  <div className="flex flex-col gap-2 p-4 border-t mt-auto">
                    <div className="flex justify-between gap-2 items-center">
                      <button
                        className="bg-primary text-white px-4 py-2 rounded-main hover:bg-primary-dark transition focus-ring"
                        onClick={() => handleAddToCart(crop)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="text-primary hover:underline font-medium"
                        onClick={() => handleCardClick(crop.id)}
                      >
                        View Details
                      </button>
                    </div>
                    {cartErrors[crop.id] && (
                      <p className="text-red-600 text-sm mt-1">{cartErrors[crop.id]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={!previous}
                onClick={() => handlePagination(previous)}
                className={`px-4 py-2 bg-primary text-white rounded-main shadow ${!previous ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"}`}
              >
                Previous
              </button>
              <button
                disabled={!next}
                onClick={() => handlePagination(next)}
                className={`px-4 py-2 bg-primary text-white rounded-main shadow ${!next ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-dark"}`}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img src="/images/no-results.svg" alt="No results" className="w-40 h-40 mb-4 opacity-70" />
            <p className="text-center text-gray-800 text-lg">No results found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
