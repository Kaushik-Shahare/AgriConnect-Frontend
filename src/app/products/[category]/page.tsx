"use client";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useParams } from "next/navigation";

interface User {
  id: number;
  profile_image: string;
  email: string;
  user_type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface QuantityAdded {
  id: number;
  quantity: number;
  added_at: string;
  crop: number;
}

interface Product {
  id: number;
  user: User;
  name: string;
  image_url: string;
  image_public_id: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  quantity_added: QuantityAdded[];
}

const ProductList: React.FC = () => {
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const { category } = useParams();

  useEffect(() => {
    if (!token) return;
    const fetchCrops = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/crop/list/crop-category/${category}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };
    fetchCrops();
  }, [token, BACKEND_URL]);

  return (
    <div className="flex flex-col min-h-screen py-10 bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {category[0].toUpperCase() + category.slice(1)} Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
