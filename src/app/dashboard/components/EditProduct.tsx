import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";

interface ESoldProduct {
  id?: number; // ID is optional for adding products
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  price?: number;
}

interface EditProductProps {
  open: boolean;
  onClose: () => void;
  product: ESoldProduct; // The product to edit
  onEdit: (product: ESoldProduct) => Promise<void>; // Expect SoldProduct directly
}

const EditProduct: React.FC<EditProductProps> = ({
  open,
  onClose,
  product,
  onEdit,
}) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [error, setError] = useState(""); // State for error messages
  const { BACKEND_URL } = useConstants();

  // Define your categories
  const categories = ["fruit", "vegetable", "grain", "dairy", "other"];

  useEffect(() => {
    // Reset form fields when product changes
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price);
    }
  }, [product]);

  const handleEditProduct = async () => {
    if (localStorage.getItem("token") == null) {
      return;
    }
    try {
      await axios.patch(
        `${BACKEND_URL}/api/crop/farmer/crop/${product.id}/`,
        {
          name,
          description,
          category,
          price: (price ?? 0).toString(), // Convert to string if needed
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Call onEdit with the updated product data if API call is successful
      onEdit({
        id: product.id,
        name,
        description,
        category,
        quantity: product.quantity, // Keep original quantity
        price,
      });

      // Close modal after editing
      onClose();
    } catch (err) {
      setError("Failed to edit product. Please try again."); // Handle the error
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Sold Product</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}{" "}
        {/* Display error message */}
        <TextField
          margin="dense"
          label="Product Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Product Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-label" sx={{ color: "text.primary" }}>
            Category
          </InputLabel>
          <Select
            labelId="category-label"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          disabled // Make the field non-editable
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleEditProduct} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProduct;
