import React, { useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";

interface AddQuantityProps {
  open: boolean;
  onClose: () => void;
  productId: number;
  onQuantityAdded: (productId: number, addedQuantity: number) => void;
}

const AddQuantity: React.FC<AddQuantityProps> = ({
  open,
  onClose,
  productId,
  onQuantityAdded,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState("");
  const { BACKEND_URL } = useConstants();

  const handleAddQuantity = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/crop/farmer/crop/add-quantity/${productId}/`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onQuantityAdded(productId, quantity);
      onClose();
    } catch (err) {
      setError("Failed to add quantity. Please try again.");
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
        <h2 className="text-xl font-semibold mb-4">Add More Quantity</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="number"
          placeholder="Additional Quantity"
          className="w-full border border-gray-300 rounded-md p-2 mb-3"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAddQuantity}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Quantity
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

export default AddQuantity;
