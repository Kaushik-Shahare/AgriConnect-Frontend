"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import Loading from "@/components/Loading";

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
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  if (purchaseHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">
        <p className="text-black">No purchases found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-black">Purchase History</h2>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {purchaseHistory.map((purchase) => (
              <div
                key={purchase.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {purchase.crop.name}
                  </h3>
                  <p className="text-gray-600">
                    Purchased at ₹{purchase.price_at_sale}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-800">
                    Quantity: {purchase.quantity_sold} kg
                  </p>
                  <p className="text-gray-500">
                    {new Date(purchase.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
