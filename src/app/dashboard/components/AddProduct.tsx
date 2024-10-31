import React, { useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";

interface SoldProduct {
  id?: number; // ID is optional for adding products
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
}

interface AddProductProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: SoldProduct) => void; // Expect SoldProduct directly
}

const AddProduct: React.FC<AddProductProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");
  const { BACKEND_URL } = useConstants();

  const categories = ["fruit", "vegetable", "grain", "dairy", "other"];

  const handleAddProduct = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/crop/farmer/crop/`,
        { name, description, category, quantity, price: price.toString() },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onAdd({
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        category: response.data.category,
        quantity: response.data.quantity,
        price: response.data.price,
      });

      setName("");
      setDescription("");
      setCategory("");
      setQuantity(0);
      setPrice(0);
      onClose();
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Add Sold Product</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Product Name"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Product Description"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
