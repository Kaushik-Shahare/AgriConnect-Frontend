import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProduct from "./AddProduct"; // Import the AddProduct modal
import EditProduct from "./EditProduct"; // Import the EditProduct modal
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"; // Icon for add quantity
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import AddQuantity from "./AddQuantity"; // Import the AddQuantity modal

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
  const [quantityModalOpen, setQuantityModalOpen] = useState(false); // State for quantity modal
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
    setCurrentProduct(product); // Set current product for adding quantity
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
          <AddIcon aria-hidden="true" focusable="false" />
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
                    <EditIcon aria-hidden="true" focusable="false" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      product.id && handleDeleteProduct(product.id)
                    }
                    color="secondary"
                  >
                    <DeleteIcon aria-hidden="true" focusable="false" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenQuantityModal(product)}
                    color="default"
                  >
                    <AddCircleOutlineIcon
                      aria-hidden="true"
                      focusable="false"
                    />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
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
          product={currentProduct}
        />
      )}
    </div>
  );
};

export default SoldProductsList;
