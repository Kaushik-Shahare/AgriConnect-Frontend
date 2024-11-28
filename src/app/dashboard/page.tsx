"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import SalesAnalysis from "./components/SalesAnalysis";
import SalesChart from "./components/SalesChart";
import SoldProductsList from "./components/SoldProductList";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import Loading from "@/components/Loading";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/crop/dashboard/sales-analysis/${period}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setData(response.data));
    setLoading(false);
  }, [period]);

  if (loading || !data) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen py-10 bg-gray-100">
      <div className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-8 text-black">
          Farmer Dashboard
        </h2>

        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              className={`${
                period === "1day" ? "bg-blue-500 text-white" : "bg-gray-200"
              } px-4 py-2 rounded`}
              onClick={() => setPeriod("1day")}
            >
              Last 1 Day
            </button>
            <button
              className={`${
                period === "30days" ? "bg-blue-500 text-white" : "bg-gray-200"
              } px-4 py-2 rounded`}
              onClick={() => setPeriod("30days")}
            >
              Last 30 Days
            </button>
            <button
              className={`${
                period === "1year" ? "bg-blue-500 text-white" : "bg-gray-200"
              } px-4 py-2 rounded`}
              onClick={() => setPeriod("1year")}
            >
              Last 1 Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <SalesAnalysis
              totalSales={data.total_sales}
              totalRevenue={data.total_revenue}
              salesData={data.product_sales.map((product) => ({
                name: product.name,
                quantitySold: product.quantity_sold,
              }))}
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ProductList products={data.product_sales} />
          </div>
        </div>

        <div className="mb-8">
          <SalesChart productSales={data.product_sales} period={period} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">My Products</h3>
          <SoldProductsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
