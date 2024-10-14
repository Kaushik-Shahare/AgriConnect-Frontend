"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/material"; // Replace "some-library" with the actual library name if it's a third-party component
import { useAuth } from "@/context/AuthContext";
import PostForm from "./components/PostForm";
import { useConstants } from "@/context/ConstantsContext";

const PostPage = () => {
  interface User {
    id: number;
    email: string;
    name: string;
  }

  interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    user: User;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const { BACKEND_URL } = useConstants();

  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/post/posts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [token, BACKEND_URL]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    handleCloseModal();
  };

  return (
    <div className="p-4 flex flex-col min-h-screen py-20 bg-gray-100">
      <Container>
        <h1 className="text-3xl font-bold mb-6 text-black">Farmer's Posts</h1>

        {/* Add Post Button */}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleOpenModal}
        >
          Add Post
        </button>

        {/* Post List */}
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 shadow-md bg-gray-400 flex flex-col justify-between"
            >
              <div>
                <p>{post.content}</p>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="Post"
                    className="mt-4 w-full h-48 object-cover"
                  />
                )}
              </div>
              <div>
                <hr></hr>
                <small className="block mt-2 text-gray-100">
                  Posted by: {post.user.name} {/* Display user name */}
                </small>
                <small className="block mt-2 text-gray-100">
                  Posted on: {new Date(post.created_at).toLocaleString()}{" "}
                  {/* Display date and time */}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* Add Post Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Create a New Post
              </h2>

              <PostForm onPostCreated={handlePostCreated} />

              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PostPage;
