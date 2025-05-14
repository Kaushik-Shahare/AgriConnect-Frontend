"use client";

import React from "react";

interface CropCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url?: string;
  sellerEmail: string;
  average_rating: number;
  number_of_ratings: number;
  onClick: (id: number) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  id,
  name,
  description,
  price,
  quantity,
  image_url,
  sellerEmail,
  average_rating,
  number_of_ratings,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="flex flex-row bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-200 hover:scale-[1.01] cursor-pointer group min-h-[180px]"
    >
      {/* Product Image */}
      <div className="flex items-center justify-center w-40 h-40 bg-gray-50 border-r border-gray-100">
        <img
          src={image_url || "/images/default-crop.jpeg"}
          alt={name}
          className="object-contain h-32 w-32 group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-black line-clamp-1">{name}</span>
          {quantity > 0 ? (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold border border-green-300">In Stock</span>
          ) : (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-semibold border border-red-300">Out of Stock</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-primary">₹{price}</span>
          <span className="text-xs text-gray-500 ml-2">per kg</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          {/* Star rating */}
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.round(average_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
            ))}
          </span>
          <span className="text-xs text-gray-600">{average_rating.toFixed(1)} ({number_of_ratings})</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2 mb-1">{description}</p>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xs text-gray-500">Sold by:</span>
          <span className="text-xs text-blue-700 font-medium">{sellerEmail}</span>
        </div>
      </div>
    </div>
  );
};
