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
  image_url: string | null;
  image_public_id: string | null;
  rating_date: string;
  crop: number;
}

interface RatingsProps {
  cropId: number;
}

const Ratings: React.FC<RatingsProps> = ({ cropId }) => {
  const { token, userId } = useAuth();
  const { BACKEND_URL } = useConstants();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState<Rating | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

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

  const handleModalOpen = (rating: Rating | null) => {
    setIsModalOpen(true);
    if (rating) {
      setCurrentRating(rating);
      setRatingValue(rating.rating);
      setComment(rating.comment);
    } else {
      setCurrentRating(null);
      setRatingValue(0);
      setComment("");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentRating(null);
    setRatingValue(0);
    setComment("");
    setImage(null);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("rating", ratingValue.toString());
    formData.append("comment", comment);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (currentRating) {
        await axios.put(
          `${BACKEND_URL}/api/crop/rate/${currentRating.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRatings((prev) =>
          prev.map((r) =>
            r.id === currentRating.id
              ? { ...r, rating: ratingValue, comment }
              : r
          )
        );
      } else {
        const response = await axios.post(
          `${BACKEND_URL}/api/crop/ratings/${cropId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRatings([response.data, ...ratings]);
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    } finally {
      handleModalClose();
    }
  };

  const handleDeleteRating = async (rating: Rating) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/crop/rate/${rating.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRatings((prev) => prev.filter((r) => r.id !== rating.id));
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ratings</h2>
      <button
        onClick={() => handleModalOpen(null)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Rating
      </button>
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
              {rating.user.id == userId && (
                <div className="ml-auto px-2 py-1 flex gap-2">
                  <button
                    onClick={() => handleModalOpen(rating)}
                    className="ml-auto bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRating(rating)}
                    className="ml-auto bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-800">{rating.comment}</p>
            {rating.image_url && (
              <img
                src={rating.image_url}
                alt="Rating"
                className="w-full h-64 object-cover mt-2"
              />
            )}
          </div>
        ))
      ) : (
        <p>No ratings available for this crop.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {currentRating ? "Edit Rating" : "Add Rating"}
            </h3>
            <label className="block mb-2">
              Rating:
              <input
                type="number"
                min={0}
                max={5}
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full mt-1"
              />
            </label>
            <label className="block mb-2">
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border rounded px-2 py-1 w-full mt-1"
              />
            </label>
            <label className="block mb-4">
              Image:
              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="border rounded px-2 py-1 w-full mt-1"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ratings;
