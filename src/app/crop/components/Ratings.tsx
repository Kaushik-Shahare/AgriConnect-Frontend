"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";

interface Rating {
  id: number;
  user: {
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
  };
  rating: number;
  comment: string;
  image: string | null;
  image_public_id: string | null;
  rating_date: string;
  crop: number;
}

interface RatingsProps {
  cropId: number;
}

const Ratings: React.FC<RatingsProps> = ({ cropId }) => {
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/crop/ratings/${cropId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRatings();
    }
  }, [cropId, token, BACKEND_URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ratings</h2>
      {ratings.length > 0 ? (
        ratings.map((rating) => (
          <div key={rating.id} className="border p-4 mb-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <img
                src={rating.user.profile_image}
                alt={rating.user.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <h3 className="font-semibold">{rating.user.name}</h3>
                <p className="text-sm text-gray-600">{rating.rating_date}</p>
              </div>
            </div>
            <p className="text-gray-800">{rating.comment}</p>
            {rating.image && (
              <img
                src={rating.image}
                alt="Rating"
                className="w-full h-64 object-cover mt-2"
              />
            )}
            {rating.rating < 3 && (
              <p className="text-red-500">Rating: {rating.rating}/5</p>
            )}
            {rating.rating === 3 && (
              <p className="text-orange-500">Rating: {rating.rating}/5</p>
            )}
            {rating.rating > 3 && (
              <p className="text-green-500">Rating: {rating.rating}/5</p>
            )}
          </div>
        ))
      ) : (
        <p>No ratings available for this crop.</p>
      )}
    </div>
  );
};

export default Ratings;
