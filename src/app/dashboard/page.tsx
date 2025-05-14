"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import SalesChart from "./components/SalesChart";
import SoldProductsList from "./components/SoldProductList";
import axios from "axios";
import { useConstants } from "@/context/ConstantsContext";
import Loading from "@/components/Loading";
import TopSellersChart from "./components/TopSellersChart";
import InventoryDonutChart from "./components/InventoryDonutChart";
import RecentSalesTable from "./components/RecentSalesTable";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface ProductSales {
  name: string;
  image_url: string;
  category: string;
  quantity_listed: number;
  quantity_remaining: number;
  price: number;
  quantity_sold: number;
  revenue: number;
  quantity_growth: number;
  revenue_growth: number;
  created_at: string;
  average_rating: number;
  number_of_ratings: number;
  sales: Array<{
    quantity_sold: number;
    price_at_sale: number;
    sale_date: string;
  }>;
}

interface SalesData {
  total_sales: number;
  total_revenue: number;
  sales_growth: number;
  revenue_growth: number;
  product_sales: ProductSales[];
  top_sellers: ProductSales[];
  inventory_breakdown: Array<{ category: string; quantity: number }>;
  recent_sales: Array<any>;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const GrowthKPI = ({ label, value }: { label: string; value: number }) => (
  <div
    className={`bg-white rounded-xl shadow p-6 flex flex-col items-center transition-transform hover:scale-105 ${
      value > 0 ? "border-green-400" : value < 0 ? "border-red-400" : "border-gray-200"
    } border-2`}
  >
    <span className="text-black text-sm mb-1">{label}</span>
    <span className={`text-3xl font-bold flex items-center gap-2 ${
      value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600"
    }`}>
      {value > 0 && <FaArrowUp className="inline" />} {value < 0 && <FaArrowDown className="inline" />} 
      <CountUp end={value} duration={1.2} decimals={1} suffix="%" />
    </span>
  </div>
);

const ProductSalesTable = ({ productSales }: { productSales: ProductSales[] }) => {
  const [sortKey, setSortKey] = useState<keyof ProductSales>("quantity_sold");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...productSales].sort((a, b) => {
    if (sortDir === "asc") {
      return (a[sortKey] as number) - (b[sortKey] as number);
    } else {
      return (b[sortKey] as number) - (a[sortKey] as number);
    }
  });

  const handleSort = (key: keyof ProductSales) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <h3 className="text-lg font-semibold text-black mb-2">Product Sales</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("name")}>Product</th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("quantity_sold")}>Sold</th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("revenue")}>Revenue</th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("quantity_growth")}>Growth</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="border p-2 text-black flex items-center gap-2">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-8 h-8 object-cover rounded" />} {p.name}
                </td>
                <td className="border p-2 text-black">{p.quantity_sold}</td>
                <td className="border p-2 text-black">₹{p.revenue.toFixed(2)}</td>
                <td className={`border p-2 text-black flex items-center gap-1 ${p.quantity_growth > 0 ? "text-green-600" : p.quantity_growth < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {p.quantity_growth > 0 && <FaArrowUp className="inline" />} {p.quantity_growth < 0 && <FaArrowDown className="inline" />} {p.quantity_growth.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState<SalesData | null>(null);
  const { BACKEND_URL } = useConstants();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/crop/dashboard/sales-analysis/30days/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <Loading />;
  }

  // KPI values
  const totalProducts = data.product_sales.length;
  const totalInventory = data.product_sales.reduce(
    (sum, p) => sum + (p.quantity_listed - p.quantity_sold),
    0
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto py-12 px-2 md:px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-8 text-black"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          Farmer Dashboard
        </motion.h2>

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-black text-sm mb-1">Total Sales</span>
            <span className="text-3xl font-bold text-primary">
              <CountUp end={data.total_sales} duration={1.2} separator="," />
            </span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-black text-sm mb-1">Total Revenue</span>
            <span className="text-3xl font-bold text-green-600">
              ₹<CountUp end={data.total_revenue} duration={1.2} separator="," decimals={2} />
            </span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-black text-sm mb-1">Total Products</span>
            <span className="text-3xl font-bold text-blue-600">
              <CountUp end={totalProducts} duration={1.2} separator="," />
            </span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:scale-105 transition-transform">
            <span className="text-black text-sm mb-1">Inventory Remaining</span>
            <span className="text-3xl font-bold text-yellow-600">
              <CountUp end={totalInventory} duration={1.2} separator="," />
            </span>
          </div>
          <GrowthKPI label="Sales Growth" value={data.sales_growth} />
          <GrowthKPI label="Revenue Growth" value={data.revenue_growth} />
        </motion.div>

        {/* Main Analytics Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-center">
            <SalesChart productSales={data.product_sales} period="30days" salesGrowth={data.sales_growth} revenueGrowth={data.revenue_growth} />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-center">
            <TopSellersChart topSellers={data.top_sellers} />
          </div>
          <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-center">
            <InventoryDonutChart inventoryBreakdown={data.inventory_breakdown} />
          </div>
        </motion.div>

        {/* Product Sales Table */}
        <ProductSalesTable productSales={data.product_sales} />

        {/* Recent Sales Table */}
        <motion.div
          className="bg-white shadow-lg rounded-xl p-6 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <RecentSalesTable recentSales={data.recent_sales} />
        </motion.div>

        {/* Collapsible Details Section */}
        <motion.details
          className="bg-white shadow-lg rounded-xl p-6 mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <summary className="text-lg font-semibold cursor-pointer mb-4">
            Detailed Product & Sales List
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ProductList products={data.product_sales} />
            </div>
            <div>
              <SoldProductsList />
            </div>
          </div>
        </motion.details>
      </div>
    </div>
  );
};

export default Dashboard;
