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
  animationDelay?: number;
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
  animationDelay = 0,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative group animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image Section */}
      <div className="relative h-48">
        <img
          src={image_url || "/images/default-crop.jpeg"}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Quantity Badge */}
        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          {quantity} available
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
            <div className="flex items-center gap-2">
              {average_rating < 3 && (
                <span className="text-sm font-semibold text-red-600">
                  {average_rating}/5
                </span>
              )}
              {average_rating >= 3 && average_rating < 4 && (
                <span className="text-sm font-semibold text-orange-600">
                  {average_rating}/5
                </span>
              )}
              {average_rating > 3 && (
                <span className="text-sm font-semibold text-green-600">
                  {average_rating}/5
                </span>
              )}
              <span className="text-sm text-gray-600">
                ({number_of_ratings})
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-semibold text-green-600">
              ₹{price}
            </span>
            <span className="text-sm text-red-600">Save 0%</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

        {/* Seller Information */}
        <div className="mt-4 text-xs text-gray-500">
          <span>Sold by: </span>
          <a
            href={`mailto:${sellerEmail}`}
            className="text-blue-600 hover:underline"
          >
            {sellerEmail}
          </a>
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"></div>
    </div>
  );
};
