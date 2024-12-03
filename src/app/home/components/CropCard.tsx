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
      className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer relative group"
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
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
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
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="bg-green-600 text-white px-4 py-2 rounded-full font-medium shadow-lg">
          View Details
        </span>
      </div>
    </div>
  );
};
