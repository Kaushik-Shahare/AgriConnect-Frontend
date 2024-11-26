import React, { useState, useEffect } from "react";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
  onEdit?: (product: SoldProduct) => void;
  product?: SoldProduct;
}

const AddProduct: React.FC<AddProductProps> = ({
  open,
  onClose,
  onAdd,
  onEdit,
  product,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [quantity, setQuantity] = useState(product?.quantity || 0);
  const [price, setPrice] = useState(product?.price || 0);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { BACKEND_URL } = useConstants();

  const categories = ["fruit", "vegetable", "grain", "dairy", "other"];

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setQuantity(product.quantity);
      setPrice(product.price);
    }
  }, [product]);

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

      const response = await axios.patch(
        `${BACKEND_URL}/api/crop/farmer/crop/${product?.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newProduct = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        category: response.data.category,
        quantity: response.data.quantity,
        price: response.data.price,
        imageUrl: response.data.image_url,
      };

      if (onAdd) onAdd(newProduct);
      resetForm();
      onClose();
    } catch (err) {
      setError("Failed to add product. Please try again.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setQuantity(0);
    setPrice(0);
    setImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
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
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
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
        <Button onClick={handleAddProduct} color="primary">
          {product ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduct;
