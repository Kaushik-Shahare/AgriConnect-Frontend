"use client";

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";

interface PostFormProps {
  onPostCreated: (newPost: any) => void;
  onClose: () => void;
}

const PostForm = ({ onPostCreated, onClose }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/post/posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setContent("");
      setImage(null);
      onPostCreated(response.data); // Pass new post data to parent
    } catch (error) {
      console.error("Error posting content:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-20 overflow-auto">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Create Post</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            required
            className="w-full p-2 border rounded-lg mb-4 text-black"
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              } else {
                setImage(null);
              }
            }}
            className="mb-4 text-black"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
