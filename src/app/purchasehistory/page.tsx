"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";

interface Crop {
  id: number;
  name: string;
  price: number;
  user: {
    email: string;
  };
}

interface Purchase {
  id: number;
  crop: Crop;
  quantity_sold: number;
  price_at_sale: string;
  sale_date: string; // Date of purchase
}

export default function PurchaseHistoryPage() {
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]); // State for purchase history
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/crop/my-orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPurchaseHistory(response.data); // Store the API data in state
      } catch (error) {
        console.error("Error fetching purchase history:", error);
        setErrorMessage("Failed to fetch purchase history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [token, BACKEND_URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col min-h-screen py-20 bg-gray-100">
        <Typography color="error">{errorMessage}</Typography>
      </div>
    );
  }

  if (purchaseHistory.length === 0) {
    return (
      <div className="flex flex-col min-h-screen py-20 bg-gray-100">
        <Typography color="black">No purchases found.</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <Container>
        <Typography variant="h4" gutterBottom color="Black">
          Purchase History
        </Typography>

        <Card>
          <CardContent>
            <List>
              {purchaseHistory.map((purchase) => (
                <React.Fragment key={purchase.id}>
                  <ListItem>
                    <Grid container spacing={2}>
                      {/* Crop Name */}
                      <Grid item xs={6}>
                        <ListItemText
                          primary={purchase.crop.name}
                          secondary={`Purchased at ₹${purchase.price_at_sale} per kg`}
                        />
                      </Grid>

                      {/* Quantity */}
                      <Grid item xs={3}>
                        <Typography>
                          Quantity: {purchase.quantity_sold} kg
                        </Typography>
                      </Grid>

                      {/* Purchase Date */}
                      <Grid item xs={3}>
                        <Typography>
                          {new Date(purchase.sale_date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
