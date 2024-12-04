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
      className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer m-4"
      onClick={() => onClick(id)}
    >
      <img
        src={image_url || "/images/default-crop.jpeg"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-lg font-bold text-primary">₹{price}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            <p className="text-sm text-gray-500">Available: {quantity} kg</p>
          </div>
          <div>
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
        </div>
      </div>
      <button className="w-full py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300">
        Buy Now
      </button>
    </div>
  );
};
