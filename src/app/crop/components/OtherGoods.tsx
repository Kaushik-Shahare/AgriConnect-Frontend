"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CropCard } from "./CropCard"; // Adjust the import based on your structure
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

interface OtherGoodsProps {
  farmerId: number;
  currentCropId: number;
}

export const OtherGoods: React.FC<OtherGoodsProps> = ({
  farmerId,
  currentCropId,
}) => {
  interface Good {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    user: {
      email: string;
    };
  }

  const [otherGoods, setOtherGoods] = useState<Good[]>([]);
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const router = useRouter();

  useEffect(() => {
    if (token == null) {
      return;
    }

    const fetchOtherGoods = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/crop/list/${farmerId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const goods = response.data.filter(
          (item: { id: number }) => item.id !== currentCropId
        );
        setOtherGoods(goods);
      } catch (error) {
        console.error("Error fetching other goods:", error);
      }
    };

    fetchOtherGoods();
  }, [token, farmerId, currentCropId]);

  OtherGoods.propTypes = {
    farmerId: PropTypes.number.isRequired,
    currentCropId: PropTypes.number.isRequired,
  };

  const handleClick = (id: number) => {
    router.push(`/crop/${id}`);
  };

  return (
    <div>
      <h5 className="text-black text-2xl font-semibold mb-4">
        Other Goods Sold by This Farmer
      </h5>
      <div className="border rounded-lg shadow-lg">
        <div className="px-8 py-4 relative">
          <div className="flex overflow-x-auto pb-2">
            {otherGoods.map((good) => (
              <div key={good.id} className="min-w-[300px] mr-2">
                <CropCard
                  id={good.id}
                  name={good.name}
                  description={good.description}
                  price={good.price}
                  quantity={good.quantity}
                  image={good.image}
                  sellerEmail={good.user.email}
                  onClick={() => handleClick(good.id)}
                />
              </div>
            ))}
            {/* Gradient shade on the right side */}
            <div className="absolute top-0 right-0 bottom-0 w-[100px] bg-gradient-to-l from-black to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
