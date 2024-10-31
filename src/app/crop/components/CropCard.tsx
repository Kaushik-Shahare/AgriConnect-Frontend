"use client";

import React from "react";

interface CropCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  sellerEmail: string;
  onClick: (id: number) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  id,
  name,
  description,
  price,
  quantity,
  image,
  sellerEmail,
  onClick,
}) => {
  return (
    <div
      className="border rounded-lg overflow-hidden shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer m-4"
      onClick={() => onClick(id)}
    >
      <img
        src={image || "/images/default-crop.jpeg"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-lg font-bold text-primary">₹{price}</p>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-sm text-gray-500">Available: {quantity} kg</p>
      </div>
      <button className="w-full py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300">
        Buy Now
      </button>
    </div>
  );
};
