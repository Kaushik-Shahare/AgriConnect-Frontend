"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
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

  const [otherGoods, setOtherGoods] = useState<Good[]>([]); // Adjust type as needed
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const router = useRouter();

  useEffect(() => {
    // Ensure token is available before making the request
    if (token == null) {
      return;
    }

    // Fetch other goods sold by the same farmer
    const fetchOtherGoods = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/crop/list/${farmerId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the header
            },
          }
        );
        // Exclude the current product from the list of other goods
        const goods = response.data.filter(
          (item: { id: number }) => item.id !== currentCropId
        );
        setOtherGoods(goods);
      } catch (error) {
        console.error("Error fetching other goods:", error);
      }
    };

    fetchOtherGoods();
  }, [token, farmerId, currentCropId]); // Ensure useEffect runs when token, farmerId, or currentCropId changes

  OtherGoods.propTypes = {
    farmerId: PropTypes.number.isRequired, // ID of the farmer
    currentCropId: PropTypes.number.isRequired, // ID of the current crop
  };

  // useEffect(() => {
  //   if (otherGoods.length === 0) {
  //     return (
  //       <Typography color="black">
  //         No other goods available from this farmer.
  //       </Typography>
  //     );
  //   }
  // }, [otherGoods]);

  const handleClick = (id: number) => {
    // Handle click event
    router.push(`/crop/${id}`); // Replace with the correct path
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom color="black">
        Other Goods Sold by This Farmer
      </Typography>
      <Grid container spacing={4}>
        {otherGoods.map((good) => (
          <Grid item xs={12} sm={6} md={4} key={good.id}>
            <CropCard
              id={good.id}
              name={good.name}
              description={good.description}
              price={good.price}
              quantity={good.quantity}
              image={good.image}
              sellerEmail={good.user.email}
              onClick={() => handleClick(good.id)} // Replace with navigation
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
