import React, { useState } from "react";

interface FiltersProps {
  onApplyFilters: (filters: {
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  }) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onApplyFilters }) => {
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [category, setCategory] = useState<string>("");

  const handleApplyFilters = () => {
    onApplyFilters({ minPrice, maxPrice, category });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Price Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="">All Categories</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="dairy">Dairy</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
      >
        Apply Filters
      </button>
    </div>
  );
};