import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
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
    if (localStorage.getItem("token") == null) {
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/crop/farmer/crop/add-quantity/${productId}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add More Quantity</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}{" "}
        {/* Display error message */}
        <TextField
          margin="dense"
          label="Additional Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddQuantity} color="primary">
          Add Quantity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuantity;
