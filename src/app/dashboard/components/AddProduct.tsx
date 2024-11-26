import React, { useState } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import {
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";

interface SoldProduct {
  id?: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface AddProductProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: SoldProduct) => void;
}

const AddProduct: React.FC<AddProductProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { BACKEND_URL } = useConstants();

  const categories = [
    "fruit",
    "vegetable",
    "grain",
    "dairy",
    "meat",
    "seafood",
    "poultry",
    "spice",
    "herb",
    "other",
  ];

  const handleAddProduct = async () => {
    if (!localStorage.getItem("token")) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("quantity", quantity.toString());
      formData.append("price", price.toString());
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/crop/farmer/crop/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onAdd({
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        category: response.data.category,
        quantity: response.data.quantity,
        price: response.data.price,
        imageUrl: response.data.image_url,
      });

      setName("");
      setDescription("");
      setCategory("");
      setQuantity(0);
      setPrice(0);
      setImage(null);
      onClose();
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Sold Product</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}

        <TextField
          label="Product Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Product Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <TextField
          select
          label="Category"
          variant="outlined"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quantity"
          type="number"
          variant="outlined"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          margin="normal"
        />

        <TextField
          label="Price"
          type="number"
          variant="outlined"
          fullWidth
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          margin="normal"
        />

        <input
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          style={{ marginTop: "1rem" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddProduct} color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduct;
