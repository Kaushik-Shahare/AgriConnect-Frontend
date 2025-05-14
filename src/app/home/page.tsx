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
import Link from "next/link";

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
  const [cropsLoading, setCropsLoading] = useState(true); // Separate loading state for crops
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true); // Loading state for the page
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;
    setPageLoading(true);

    const fetchCrops = async () => {
      try {
        setCropsLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/crop/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCrops(response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      } finally {
        setCropsLoading(false);
      }
    };

    fetchCrops();
    setPageLoading(false);
  }, [token]);

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  // Filter crops by search term
  const filteredCrops = crops.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Example categories (replace with real categories if available)
  const categories = [
    { name: "Cereals", image: "/images/cereals 2.jpeg", slug: "cereals" },
    { name: "Dairy", image: "/images/dairy 2.jpeg", slug: "dairy" },
    { name: "Vegetarian", image: "/images/vegetarian.jpeg", slug: "vegetarian" },
    { name: "Non-Vegetarian", image: "/images/home-banner2.jpeg", slug: "non-vegetarian" },
    { name: "Fruits", image: "/images/fruits.jpeg", slug: "fruits" },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (pageLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-100 to-green-50">
      <AIChatAssistant />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-400 to-blue-500 text-white py-16 overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-[url('/images/home-banner.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up delay-100 drop-shadow-lg">
            Welcome to AgriConnect
          </h1>
          <p className="text-lg md:text-xl mb-6 animate-fade-in-up delay-200">
            Your trusted marketplace for fresh produce and farm products
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-main border border-gray-300 text-black focus-ring"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button
              className="bg-primary text-white px-6 py-3 rounded-main shadow hover:bg-primary-dark transition-all duration-200 focus-ring"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <Link href="#featured-products">
            <button className="bg-white text-primary font-semibold px-6 py-3 rounded-main shadow-lg hover:bg-primary hover:text-white hover:scale-105 transition-transform duration-300 animate-fade-in-up delay-300">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-8 animate-fade-in-up delay-200">
        <h2 className="text-2xl font-semibold mb-4 text-black">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((item, idx) => (
            <Link href={`/products/${item.slug}`} key={item.name}>
              <div
                className={`flex flex-col items-center gap-2 hover:scale-110 transform transition duration-300 animate-fade-in-up cursor-pointer bg-white rounded-main shadow-main p-4`} style={{ animationDelay: `${100 * idx}ms` }}
              >
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full shadow-lg overflow-hidden border-2 border-green-400 group-hover:border-blue-500 transition-all duration-300">
                  <img
                    className="h-full w-full object-cover scale-100 group-hover:scale-110 transition-transform duration-300"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <p className="text-sm md:text-base font-medium text-black">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-6 mx-6" />

      {/* Featured Products Section */}
      <div id="featured-products" className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">Featured Products</h2>
        {cropsLoading ? (
          <Loading />
        ) : filteredCrops.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.slice(0, 6).map((crop, idx) => (
              <div
                key={crop.id}
                className="rounded-main shadow-main overflow-hidden border border-gray-200 hover:shadow-xl transition bg-white flex flex-col"
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
                  animationDelay={idx * 100}
                />
                <div className="flex justify-between items-center p-4 border-t mt-auto">
                  <button className="bg-primary text-white px-4 py-2 rounded-main hover:bg-primary-dark transition focus-ring">
                    Add to Cart
                  </button>
                  <Link href={`/crop/${crop.id}`} className="text-primary hover:underline font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-6 mx-6" />

      {/* Carousel Section (Best Sellers/New Arrivals) */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4 text-black">Best Sellers</h2>
        <div className="rounded-main shadow-main overflow-hidden">
          <Carousel />
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-300 my-6 mx-6" />

      {/* (Optional) Testimonials/Trust Section could go here */}
    </div>
  );
}
