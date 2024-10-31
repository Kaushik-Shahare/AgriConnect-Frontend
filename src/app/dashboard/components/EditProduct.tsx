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
  onEdit?: (product: SoldProduct) => void; // Optional onEdit function
  product?: SoldProduct; // Optional product prop for editing
}

const AddProduct: React.FC<AddProductProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(""); // State for error messages
  const { BACKEND_URL } = useConstants();

  // Define your categories
  const categories = ["fruit", "vegetable", "grain", "dairy", "other"];

  const handleAddProduct = async () => {
    if (localStorage.getItem("token") == null) {
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/crop/farmer/crop/`,
        {
          name,
          description,
          category,
          quantity,
          price: price.toString(), // Convert to string if needed
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Call onAdd with the new product data if API call is successful
      onAdd({
        id: response.data.id, // Ensure you return an id when adding
        name: response.data.name,
        description: response.data.description,
        category: response.data.category,
        quantity: response.data.quantity,
        price: response.data.price,
      });

      // Reset form fields and close modal
      setName("");
      setDescription("");
      setCategory("");
      setQuantity(0);
      setPrice(0);
      onClose();
    } catch (err) {
      setError("Failed to add product. Please try again."); // Handle the error
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
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}{" "}
        {/* Display error message */}
        <input
          type="text"
          placeholder="Product Name"
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Description"
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
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
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Price"
          className="border border-gray-300 rounded-md p-2 mb-3 w-full"
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
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default AddProduct;
