import React, { useState } from "react";
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Sold Product</DialogTitle>
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
          onChange={(e) => setQuantity(Number(e.target.value))}
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
        <Button onClick={handleAddProduct} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduct;
