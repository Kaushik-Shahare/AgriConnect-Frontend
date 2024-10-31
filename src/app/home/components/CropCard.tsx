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
      onClick={() => onClick(id)}
      className="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
    >
      <img
        src={image || "/images/default-crop.jpeg"}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <span className="text-lg font-semibold text-gray-900">₹{price}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
      <button
        onClick={() => onClick(id)}
        className="w-full bg-blue-600 text-white py-2 text-center font-semibold hover:bg-blue-700 transition-colors duration-300"
      >
        Buy Now
      </button>
    </div>
  );
};
