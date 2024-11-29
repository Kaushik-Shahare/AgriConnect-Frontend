import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import AddProduct from "./AddProduct"; // Import the AddProduct modal
import EditProduct from "./EditProduct"; // Import the EditProduct modal
import AddQuantity from "./AddQuantity"; // Import the AddQuantity modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";

interface SoldProduct {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
  description: string;
  category: string;
  image_url?: string;
}

const SoldProductsList: React.FC = () => {
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<SoldProduct | null>(
    null
  );
  const { BACKEND_URL } = useConstants();

  const fetchSoldProducts = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      return;
    }
    try {
      const response = await axios.get(`${BACKEND_URL}/api/crop/farmer/crop/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSoldProducts(response.data);
    } catch (error) {
      console.error("Error fetching sold products:", error);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchSoldProducts();
  }, [fetchSoldProducts]);

  const handleOpenAddModal = () => setAddModalOpen(true);
  const handleCloseAddModal = () => setAddModalOpen(false);

  const handleOpenEditModal = (product: SoldProduct) => {
    setCurrentProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setCurrentProduct(null);
    setEditModalOpen(false);
  };

  const handleOpenQuantityModal = (product: SoldProduct) => {
    setCurrentProduct(product);
    setQuantityModalOpen(true);
  };

  const handleCloseQuantityModal = () => {
    setCurrentProduct(null);
    setQuantityModalOpen(false);
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/crop/farmer/crop/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSoldProducts(); // Fetch updated products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddProduct = async (newProduct: SoldProduct) => {
    try {
      fetchSoldProducts();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (updatedProduct: SoldProduct) => {
    if (currentProduct) {
      const fullUpdatedProduct: SoldProduct = {
        ...currentProduct,
        ...updatedProduct,
      };
      try {
        fetchSoldProducts();
      } catch (error) {
        console.error("Error updating product:", error);
      }
      handleCloseEditModal();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">List of Products</h2>
        <button onClick={handleOpenAddModal} className="text-blue-500">
          <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {soldProducts.length === 0 ? (
          <p>No products sold.</p>
        ) : (
          soldProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-md p-4 mb-2 relative bg-white shadow"
            >
              <div className="grid grid-cols-3 justify-start">
                <div>
                  <img
                    src={product.image_url || "/images/default-crop.jpeg"}
                    alt={product.name}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p>Quantity: {product.quantity}</p>
                  <p>Category: {product.category || "N/A"}</p>
                  <p>
                    Price at Sale: Rs.{" "}
                    {product.price ? product.price.toFixed(2) : "N/A"}
                  </p>
                  <p>
                    Listed at:{" "}
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    Updated Date:{" "}
                    {product.updated_at
                      ? new Date(product.updated_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="absolute right-2 top-2 flex space-x-2">
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="text-blue-500"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-6 w-6" />
                </button>
                <button
                  onClick={() => product.id && handleDeleteProduct(product.id)}
                  className="text-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-6 w-6" />
                </button>
                <button
                  onClick={() => handleOpenQuantityModal(product)}
                  className="text-gray-500"
                >
                  <FontAwesomeIcon icon={faPlusSquare} className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <AddQuantity
        open={quantityModalOpen}
        onClose={handleCloseQuantityModal}
        productId={currentProduct?.id || 0}
        onQuantityAdded={fetchSoldProducts}
      />
      <AddProduct
        open={addModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddProduct}
      />
      {currentProduct && (
        <EditProduct
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onEdit={handleEditProduct}
          onAdd={handleAddProduct}
          product={currentProduct}
        />
      )}
    </div>
  );
};

export default SoldProductsList;
