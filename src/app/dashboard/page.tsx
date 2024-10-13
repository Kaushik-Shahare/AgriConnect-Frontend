"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import SalesAnalysis from "./components/SalesAnalysis";
import SalesChart from "./components/SalesChart"; // Import the new SalesChart component
import SoldProductsList from "./components/SoldProductList"; // Import SoldProductsList
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import {
  Container,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

interface SalesData {
  total_sales: number;
  total_revenue: number;
  product_sales: Array<{
    name: string;
    quantity_listed: number;
    price: number;
    quantity_sold: number;
    sales: Array<{
      quantity_sold: number;
      quantity_listed: number;
      quantity_remaining: number;
      price_at_sale: number;
      sale_date: string;
    }>;
  }>;
}

const Dashboard = () => {
  const [data, setData] = useState<SalesData | null>(null);
  const [period, setPeriod] = useState("30days");
  const { BACKEND_URL } = useConstants();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/crop/dashboard/sales-analysis/${period}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setData(response.data));
  }, [period]);

  if (!data) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <Container className="flex flex-col min-h-screen py-20">
        <Typography variant="h4" gutterBottom align="center" color="black">
          Farmer Dashboard
        </Typography>

        <Card>
          <CardContent>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant={period === "1day" ? "contained" : "outlined"}
                  onClick={() => setPeriod("1day")}
                  sx={{ color: "black" }}
                >
                  Last 1 Day
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={period === "30days" ? "contained" : "outlined"}
                  onClick={() => setPeriod("30days")}
                  sx={{ color: "black" }}
                >
                  Last 30 Days
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant={period === "1year" ? "contained" : "outlined"}
                  onClick={() => setPeriod("1year")}
                  sx={{ color: "black" }}
                >
                  Last 1 Year
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4} style={{ marginTop: "20px" }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <SalesAnalysis
                  totalSales={data.total_sales}
                  totalRevenue={data.total_revenue}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <ProductList products={data.product_sales} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} style={{ marginTop: "20px" }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <SalesChart
                  productSales={data.product_sales} // Pass product sales directly
                  period={period}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* New SoldProductsList Component */}
        <Grid container spacing={4} style={{ marginTop: "20px" }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  My Products
                </Typography>
                <SoldProductsList
                // Now soldProducts will be fetched in the SoldProductsList component itself
                // onAddProduct={(product) => {
                // Handle adding a new product
                // console.log("Product added:", product);
                // }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
