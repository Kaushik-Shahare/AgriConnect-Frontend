import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProduct from "./AddProduct"; // Import the AddProduct modal
import EditProduct from "./EditProduct"; // Import the EditProduct modal
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";

interface SoldProduct {
  id?: number;
  name: string;
  quantity: number;
  price?: number;
  created_at?: string;
  updated_at?: string;
  description?: string;
  category?: string;
}

const SoldProductsList: React.FC = () => {
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
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
      // Optionally, show an error notification to the user
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

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/crop/farmer/crop/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Fetch updated products after deletion
      fetchSoldProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      // Optionally, show an error notification to the user
    }
  };

  const handleAddProduct = async (newProduct: SoldProduct) => {
    try {
      // await axios.post(`${BACKEND_URL}/api/crop/farmer/crop/`, newProduct, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token")}`,
      //   },
      // });
      fetchSoldProducts();
      handleCloseAddModal();
    } catch (error) {
      console.error("Error adding product:", error);
      // Optionally, show an error notification to the user
    }
  };

  const handleEditProduct = async (updatedProduct: SoldProduct) => {
    if (currentProduct) {
      const fullUpdatedProduct: SoldProduct = {
        ...currentProduct,
        ...updatedProduct,
      };
      try {
        await axios.patch(
          `${BACKEND_URL}/api/crop/farmer/crop/${currentProduct.id}/`,
          fullUpdatedProduct,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchSoldProducts();
      } catch (error) {
        console.error("Error updating product:", error);
        // Optionally, show an error notification to the user
      }
      handleCloseEditModal();
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">List of Products</Typography>
        <IconButton onClick={handleOpenAddModal} color="primary">
          <AddIcon />
        </IconButton>
      </div>
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {soldProducts.length === 0 ? (
          <Typography variant="body1">No products sold.</Typography>
        ) : (
          soldProducts.map((product) => (
            <Card
              key={product.id}
              style={{ marginBottom: "10px", position: "relative" }}
            >
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2">
                  Quantity: {product.quantity}
                </Typography>
                <Typography variant="body2">
                  Category: {product.category || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Price at Sale: Rs.{" "}
                  {product.price ? product.price.toFixed(2) : "N/A"}
                </Typography>
                <Typography variant="body2">
                  Listed at:{" "}
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <Typography variant="body2">
                  Updated Date:{" "}
                  {product.updated_at
                    ? new Date(product.updated_at).toLocaleDateString()
                    : "N/A"}
                </Typography>
                <div
                  style={{ position: "absolute", right: "10px", top: "10px" }}
                >
                  <IconButton
                    onClick={() => handleOpenEditModal(product)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      product.id && handleDeleteProduct(product.id)
                    }
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
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
          product={currentProduct}
        />
      )}
    </div>
  );
};

export default SoldProductsList;
