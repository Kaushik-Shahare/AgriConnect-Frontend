"use client";

import React from "react";

interface CropCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_url?: string;
  onClick: (id: number) => void;
  onIncreaseQuantity?: (id: number) => void;
  onDecreaseQuantity?: (id: number) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  id,
  name,
  description,
  price,
  quantity,
  image_url,
  onClick,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-300 rounded-lg shadow-md p-4 ">
      {/* Product Image */}
      <img
        src={image_url || "/images/default-crop.jpeg"}
        alt={name}
        className="w-20 h-20 object-cover rounded-md cursor-pointer"
        onClick={() => onClick(id)}
      />

      {/* Product Details */}
      <div className="flex-grow">
        <h3
          className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-500"
          onClick={() => onClick(id)}
        >
          {name}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {description || "No description available"}
        </p>
        <div className="mt-2">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => onDecreaseQuantity && onDecreaseQuantity(id)}
        >
          -
        </button>
        <span className="text-gray-800 font-medium">{quantity}</span>
        <button
          className="bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300"
          onClick={() => onIncreaseQuantity && onIncreaseQuantity(id)}
        >
          +
        </button>
      </div>
    </div>
  );
};
