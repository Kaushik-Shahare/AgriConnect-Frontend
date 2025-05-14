"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

interface Crop {
  id: number;
  name: string;
  price: number;
  image_url?: string;
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
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setPurchaseHistory(response.data);
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
    return <Loading />;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">
        <p className="text-red-500 text-black">{errorMessage}</p>
      </div>
    );
  }

  if (purchaseHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-black text-lg font-semibold mb-2">No purchases found.</p>
          <p className="text-black">Start shopping to see your orders here!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold mb-6 text-black"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Purchase History
        </motion.h2>

        <motion.div
          className="bg-white shadow-md rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="divide-y divide-gray-200">
            {purchaseHistory.map((purchase) => (
              <div
                key={purchase.id}
                className="p-4 flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {purchase.crop.image_url ? (
                    <img
                      src={purchase.crop.image_url}
                      alt={purchase.crop.name}
                      className="w-16 h-16 object-cover rounded shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-black font-bold">
                      {purchase.crop.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-black">
                      {purchase.crop.name}
                    </h3>
                    <p className="text-black">Purchased at ₹{purchase.price_at_sale}</p>
                    <p className="text-black text-sm">Seller: {purchase.crop.user.email}</p>
                  </div>
                </div>
                <div className="text-right w-full md:w-auto">
                  <p className="text-black font-semibold">
                    Quantity: {purchase.quantity_sold} kg
                  </p>
                  <p className="text-black text-sm">
                    {new Date(purchase.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
