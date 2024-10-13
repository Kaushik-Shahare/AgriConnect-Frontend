"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  styled,
} from "@mui/material";

// Styled Card component for hover effect
const HoverCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer", // Add pointer cursor on hover
  "&:hover": {
    transform: "scale(1.05)", // Scale up on hover
    boxShadow: theme.shadows[6], // Increase shadow on hover
  },
}));

interface CropCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  sellerEmail: string;
  onClick: (id: number) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  id,
  name,
  description,
  price,
  quantity,
  image,
  sellerEmail,
  onClick,
}) => {
  return (
    <HoverCard onClick={() => onClick(id)}>
      <CardMedia
        component="img"
        alt={name}
        height="200"
        image={image || "/images/default-crop.jpeg"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          ₹{price}
        </Typography>
        <Typography gutterBottom variant="h6">
          {name}
        </Typography>
      </CardContent>
      <Button variant="contained" color="primary" fullWidth>
        Buy Now
      </Button>
    </HoverCard>
  );
};
