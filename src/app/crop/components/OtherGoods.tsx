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
    image_url: string;
    user: {
      email: string;
    };
    average_rating?: number;
    number_of_ratings?: number;
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

  // Scroll handler functions
  const scrollLeft = () => {
    const container = document.getElementById("goodsSlider");
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("goodsSlider");
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <h5 className="text-black text-2xl font-semibold mb-4">
        Other Goods Sold by This Farmer
      </h5>
      <div className="relative">
        <div className="absolute top-0 left-0 bottom-0 flex items-center">
          <button
            onClick={scrollLeft}
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
          >
            &#10094;
          </button>
        </div>
        <div className="border rounded-lg shadow-lg">
          <div className="px-8 py-4">
            <div
              id="goodsSlider"
              className="flex overflow-x-auto scroll-smooth pb-2 gap-4"
            >
              {otherGoods.map((good) => (
                <div key={good.id} className="min-w-[300px] max-w-[300px]">
                  <CropCard
                    id={good.id}
                    name={good.name}
                    description={good.description}
                    price={good.price}
                    quantity={good.quantity}
                    image_url={good.image_url}
                    sellerEmail={good.user.email}
                    average_rating={good.average_rating || 0}
                    number_of_ratings={good.number_of_ratings || 0}
                    onClick={() => handleClick(good.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 bottom-0 flex items-center">
          <button
            onClick={scrollRight}
            className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
          >
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};
