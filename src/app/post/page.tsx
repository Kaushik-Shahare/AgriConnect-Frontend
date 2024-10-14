"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/material";
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
    likes: number[];
    likes_count: number;
  }

  interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { token, userId } = useAuth(); // Get userId from AuthContext
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

  const handleOpenModal = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setComments([]);
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !selectedPost) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/post/posts/comment/${selectedPost.id}/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([
        ...comments,
        {
          id: Date.now(),
          content: newComment,
          user: { id: 0, email: "", name: "You" },
          created_at: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  const handleLikePost = async (postId: number) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/post/posts/like/${postId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the liked state in the post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: post.likes.includes(userId)
                  ? post.likes_count - 1
                  : post.likes_count + 1,
                liked_users: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId) // Remove userId if already liked
                  : [...post.likes, userId], // Add userId if not already liked
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col min-h-screen py-20 bg-gray-100">
      <Container>
        <h1 className="text-3xl font-bold mb-6 text-black">Farmer's Posts</h1>

        {/* Add Post Button */}
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setIsModalOpen(true)}
        >
          Add Post
        </button>

        {/* Instagram-like Post Grid */}
        <div className="mt-6 grid gap-2 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative cursor-pointer group h-48 overflow-hidden"
              onClick={() => handleOpenModal(post)}
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-300 flex items-center justify-center text-gray-600 w-full h-full">
                  No Image
                </div>
              )}

              {/* Hover overlay for additional info */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2 text-white">
                <p className="text-sm font-bold">{post.user.name}</p>
                <p className="text-sm line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs">{post.likes_count} Likes</span>
                  <button
                    className="text-xs underline"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening post modal
                      handleOpenModal(post);
                    }}
                  >
                    Comments
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                  >
                    {post.likes.includes(userId) ? (
                      <span className="text-red-600">❤️</span>
                    ) : (
                      <span className="text-red-400">🤍</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post Modal - To view individual post content and comments */}
        {isModalOpen && selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {selectedPost.user.name}'s Post
              </h2>
              {selectedPost.image_url && (
                <img
                  src={selectedPost.image_url}
                  alt="Post"
                  className="w-full h-64 object-cover"
                />
              )}
              <p className="mt-4 text-black">{selectedPost.content}</p>
              <small className="block mt-2 text-gray-600">
                Posted on: {new Date(selectedPost.created_at).toLocaleString()}
              </small>

              {/* Comments Section */}
              <div className="mt-4">
                <h3 className="text-lg font-bold text-black">Comments</h3>
                <div className="max-h-40 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b py-2">
                      <div className="flex flex-col justify-between">
                        <p className="font-semibold text-black">
                          {comment.user.name}
                        </p>
                        <small className="text-gray-500 mr-0">
                          {new Date(comment.created_at).toLocaleString()}
                        </small>
                      </div>
                      <div className="flex flex-row">
                        <p className="text-gray-500">{"> "}</p>
                        <p className="text-black">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleCommentSubmit} className="mt-2">
                  <textarea
                    className="border w-full p-2 text-black"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Comment
                  </button>
                </form>
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

        {/* Add Post Modal */}
        {isModalOpen && !selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">Add Post</h2>
              <PostForm
                onPostCreated={handlePostCreated}
                closeModel={handleCloseModal}
              />
              <button
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default PostPage;
