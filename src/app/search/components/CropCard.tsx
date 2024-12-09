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
      className="flex flex-row bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    >
      <img
        src={image_url || "/images/default-crop.jpeg"}
        alt={name}
        className="w-48 h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
        <div className="flex items-center gap-2">
          {average_rating < 3 && (
            <span className="text-md font-semibold text-red-600">
              {average_rating}/5
            </span>
          )}
          {average_rating >= 3 && average_rating < 4 && (
            <span className="text-md font-semibold text-orange-600">
              {average_rating}/5
            </span>
          )}
          {average_rating > 3 && (
            <span className="text-md font-semibold text-green-600">
              {average_rating}/5
            </span>
          )}
          <p className="text-sm text-gray-500">({number_of_ratings})</p>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
        <span className="text-[2.5rem] font-semibold text-gray-900">
          ₹{price}
        </span>
        <span className="text-sm text-gray-500">Save 0%</span>
      </div>
    </div>
  );
};
