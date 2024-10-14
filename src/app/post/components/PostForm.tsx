"use client";

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";

interface PostFormProps {
  onPostCreated: (newPost: any) => void;
  closeModel: () => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
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
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        required
        className="w-full p-2 border rounded mb-4 text-black"
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Post
      </button>
    </form>
  );
};

export default PostForm;
