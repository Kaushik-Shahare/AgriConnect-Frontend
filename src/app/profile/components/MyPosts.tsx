"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useConstants } from "@/context/ConstantsContext";

const PostPage = () => {
  interface User {
    id: number;
    email: string;
    name: string;
  }

  interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
  }

  interface Post {
    id: number;
    content: string;
    image_url?: string;
    created_at: string;
    user: User;
    likes: number[];
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { token, userId } = useAuth();
  const { BACKEND_URL } = useConstants();

  useEffect(() => {
    if (!token) return;

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/post/posts/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [token, BACKEND_URL]);

  const handleOpenModal = async (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
    await fetchComments(post.id);
  };

  const fetchComments = async (postId: number) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/post/posts/comment/${postId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
  };

  return (
    <div className="p-4 flex flex-col min-h-screen py-8 bg-white rounded shadow-md">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6 text-black">My Posts</h1>

        {/* Post Grid - Instagram Style */}
        <div className="mt-6 grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative cursor-pointer group"
              onClick={() => handleOpenModal(post)}
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-80 object-cover rounded-md"
                />
              ) : (
                <div className="bg-gray-300 flex items-center justify-center text-gray-600 w-full h-48 rounded-md">
                  No Image
                </div>
              )}

              {/* Hover overlay for additional info */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white rounded-md">
                <p className="text-sm font-bold">{post.user.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Post Modal */}
        {isModalOpen && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {selectedPost.user.name}'s Post
              </h2>
              {selectedPost.image_url && (
                <img
                  src={selectedPost.image_url}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-md"
                />
              )}
              <p className="mt-4 text-black">{selectedPost.content}</p>
              <small className="block mt-2 text-gray-600">
                Posted on: {new Date(selectedPost.created_at).toLocaleString()}
              </small>

              {/* Likes section */}
              <div className="mt-4 flex items-center">
                <span className="ml-2">{selectedPost.likes.length} Likes</span>
              </div>

              {/* Comments section */}
              <div className="mt-4 max-h-48 overflow-y-auto">
                <h3 className="text-lg font-semibold">Comments:</h3>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="mt-2">
                      <p className="font-bold">{comment.user.name}</p>
                      <p className="text-gray-700">{comment.content}</p>
                      <small className="text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>

              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
