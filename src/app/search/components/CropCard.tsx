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
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <span className="text-[2.5rem] font-semibold text-gray-900">
          ₹{price}
        </span>
      </div>
    </div>
  );
};
