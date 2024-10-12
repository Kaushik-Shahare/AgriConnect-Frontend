import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";

interface CropDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  user: {
    email: string;
  };
}

export default function CropDetailPage() {
  const router = useRouter();
  const { id } = router.query; // Get the crop ID from the URL
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();

  const [crop, setCrop] = useState<CropDetail | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch crop details by ID
      const fetchCropDetails = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/crop/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCrop(response.data);
        } catch (error) {
          console.error("Error fetching crop details:", error);
        }
      };
      fetchCropDetails();
    }
  }, [id, token]);

  if (!crop) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          alt={crop.name}
          height="400"
          image={crop.image || "/images/default-crop.jpeg"}
        />
        <CardContent>
          <Typography variant="h4">{crop.name}</Typography>
          <Typography variant="body1">{crop.description}</Typography>
          <Typography variant="h6" color="primary">
            Price: ₹{crop.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantity: {crop.quantity} kg
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seller: {crop.user.email}
          </Typography>
        </CardContent>
        <Button variant="contained" color="primary" fullWidth>
          Contact Seller
        </Button>
      </Card>
    </Container>
  );
}
