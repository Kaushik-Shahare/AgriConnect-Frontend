"use client";

import React, { useEffect, useState } from "react";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CropCard } from "./components/CropCard";
import Loading from "@/components/Loading";

const CartPage: React.FC = () => {
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();

  interface CartItem {
    id: number;
    crop: Crop;
    quantity: number;
  }

  interface Crop {
    id: number;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    image_url: string | null;
    user: {
      email: string;
    };
  }

  useEffect(() => {
    setLoading(true); // Start loading
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/cart/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.cart_items || []);
        setTotalPrice(response.data.total_price || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (token) {
      fetchCart();
    } else {
      setLoading(false); // Stop loading if no token
    }
  }, [token]);

  const handleCardClick = (cropId: number) => {
    router.push(`/crop/${cropId}`);
  };

  const UpdateCartItem = async (
    id: number,
    cropId: number,
    newQuantity: number
  ) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/cart/add-to-cart/${id}/`,
        {
          crop: cropId,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch cart to ensure consistency
      const response = await axios.get(`${BACKEND_URL}/api/cart/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.cart_items);
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleIncreaseQuantity = (id: number, cropId: number) => {
    const item = cartItems.find((item) => item.crop.id === cropId);
    if (item) {
      UpdateCartItem(id, cropId, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: number, cropId: number) => {
    const item = cartItems.find((item) => item.crop.id === cropId);
    if (item && item.quantity > 1) {
      UpdateCartItem(id, cropId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      UpdateCartItem(id, cropId, 0);
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/cart/checkout/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.push("/purchasehistory");
    } catch (error) {
      console.error("Error checking out cart:", error);
    }
  };

  if (loading) {
    // Render loading spinner
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen py-20 bg-gray-100">
      <div className="max-w-7xl lg:mx-10 sm:mx-4 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>

        {/* Cart Items Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {/* Items */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 text-center">
                Your cart is empty. Browse items to add to your cart!
              </div>
            ) : (
              cartItems.map((item) => (
                <CropCard
                  key={item.id}
                  id={item.crop.id}
                  name={item.crop.name}
                  description={
                    item.crop.description || "No description available"
                  }
                  price={item.crop.price}
                  quantity={item.quantity}
                  image_url={item.crop.image_url || ""}
                  onClick={handleCardClick}
                  onIncreaseQuantity={() =>
                    handleIncreaseQuantity(item.id, item.crop.id)
                  }
                  onDecreaseQuantity={() =>
                    handleDecreaseQuantity(item.id, item.crop.id)
                  }
                />
              ))
            )}
          </div>

          {/* Summary Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Tax</span>
              <span>₹{(totalPrice * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
              <span>Total</span>
              <span>₹{(totalPrice * 1.1).toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
