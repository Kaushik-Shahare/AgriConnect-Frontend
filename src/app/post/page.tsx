"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import PostForm from "./components/PostForm";
import { useConstants } from "@/context/ConstantsContext";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const PostPage = () => {
  interface User {
    id: number;
    email: string;
    profile_image: string;
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
    liked: boolean;
  }

  interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: User;
    likes: number[];
    likes_count: number;
    liked: boolean;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { token, userId } = useAuth();
  const { BACKEND_URL } = useConstants();
  const DEFAULT_IMAGE_URL = "/images/default_profile.jpg";

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

  const handleCommentSubmit = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/post/posts/comment/${postId}/`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: post.likes_count,
                likes: post.likes,
              }
            : post
        )
      );
      setNewComment("");
      fetchComments(postId); // Fetch comments again to update the view
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setIsCreateModalOpen(false);
  };

  const handleLikePost = async (postId: number) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/post/posts/like/${postId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prevPosts: Post[]) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes_count: post.likes.includes(userId)
                  ? post.likes_count - 1
                  : post.likes_count + 1,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
                liked: post.likes.includes(userId) ? false : true,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/post/posts/comment/like/${commentId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prevComments: Comment[]) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes_count: comment.likes.includes(userId)
                  ? comment.likes_count - 1
                  : comment.likes_count + 1,
                likes: comment.likes.includes(userId)
                  ? comment.likes.filter((id) => id !== userId)
                  : [...comment.likes, userId],
                liked: comment.likes.includes(userId) ? false : true,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postedDate = new Date(date);
    const seconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${seconds} seconds ago`;
  };

  return (
    <div className="p-4 flex flex-col min-h-screen py-20 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">Farmer's Posts</h1>

        <div className="mt-6 grid gap-2 grid-cols-1">
          {posts.map((post: Post) => (
            <div
              key={post.id}
              className="relative border border-gray-600 p-4 rounded"
            >
              <div className="flex flex-row items-center p-2">
                <img
                  src={post.user.profile_image || DEFAULT_IMAGE_URL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-sm font-bold text-black ml-2">
                  {post.user.name}
                </p>
              </div>

              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full object-cover"
                />
              )}

              <div className="p-2">
                <p className="text-black line-clamp-2">
                  {post.content.length > 100
                    ? `${post.content.slice(0, 100)}... `
                    : post.content}
                  {post.content.length > 100 && (
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => alert(post.content)}
                    >
                      more
                    </span>
                  )}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                  >
                    {post.liked ? (
                      <span className="text-red-600">❤️</span>
                    ) : (
                      <span className="text-red-400">🤍</span>
                    )}
                  </button>
                  <span className="text-xs text-black my-auto">
                    {post.likes_count}
                  </span>
                </div>

                <form
                  onSubmit={(e) => handleCommentSubmit(e, post.id)}
                  className="mt-2 flex gap-2"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Add a comment..."
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Submit
                  </button>
                </form>

                {/* Button to view comments */}
                <button
                  onClick={() => {
                    fetchComments(post.id); // Fetch comments on open
                    setSelectedPost(post);
                  }}
                  className="text-xs underline text-black mt-2"
                >
                  View Comments
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-20 overflow-auto">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Comments for {selectedPost.user.name}'s Post
              </h2>
              <div className="max-h-80 overflow-y-auto">
                {comments.map((comment: Comment) => (
                  <div key={comment.id} className="border-b py-2">
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                          <p className="font-semibold text-black">
                            {comment.user.name}
                          </p>
                          <small className="text-gray-500 my-auto pl-2">
                            {formatTimeAgo(comment.created_at)}
                          </small>
                        </div>
                        <div className="pr-2 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeComment(comment.id);
                            }}
                          >
                            {comment.liked ? (
                              <span className="text-red-600">❤️</span>
                            ) : (
                              <span className="text-red-400">🤍</span>
                            )}
                          </button>
                          <span className="text-xs text-black my-auto">
                            {comment.likes_count}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Fab
          onClick={() => setIsCreateModalOpen(true)}
          color="primary"
          aria-label="add"
          className="fixed bottom-16 right-8"
        >
          <AddIcon />
        </Fab>
        {isCreateModalOpen && (
          <PostForm
            onPostCreated={handlePostCreated}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PostPage;
