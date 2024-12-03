"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";

const AIChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [markdownResponse, setMarkdownResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const { BACKEND_URL } = useConstants();
  const { token, user } = useAuth();

  useEffect(() => {
    // Load chat history from localStorage
    const storedHistory = localStorage.getItem("aiChatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    // Save chat history to localStorage
    localStorage.setItem("aiChatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const fetchAiResponse = async (query: string) => {
    setLoading(true);
    setMarkdownResponse(null); // Clear previous response
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/ai-assistant/?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const newEntry = { query, response: data.markdown };
      setChatHistory((prev) => [...prev, newEntry]); // Update chat history
      setMarkdownResponse(data.markdown); // Update with AI response
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMarkdownResponse("**Error:** Unable to fetch AI response.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      fetchAiResponse(query.trim());
      setQuery(""); // Clear input field
    }
  };

  return (
    <div className="rounded-xl fixed z-10 right-4 bottom-4">
      <div className="opacity-100 rounded-xl">
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 grid place-items-center border shadow-2xl w-[3rem] h-[3rem] p-1 bg-blue-200 rounded-full hover:bg-blue-300"
        >
          <FontAwesomeIcon icon={faRobot} className="text-2xl text-gray-800" />
        </button>
        {open && (
          <div className="fixed p-[1rem] bottom-20 lg:bottom-24 right-5 lg:right-10 z-50 shadow-xl bg-gray-200 border border-black rounded w-80">
            <div className="flex items-center gap-3">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRobot}
                  className="text-2xl text-gray-800"
                />
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                AI Chat Assistant
              </h2>
            </div>

            {loading && <p className="text-gray-600 mt-2">Loading...</p>}
            <div className="mt-4 max-h-80 overflow-auto border-t border-gray-400 pt-2">
              {chatHistory.map((entry, index) => (
                <div key={index} className="mb-3">
                  <p className="font-semibold">You:</p>
                  <p className="bg-white p-2 rounded border">{entry.query}</p>
                  <p className="font-semibold mt-2">AI:</p>
                  <ReactMarkdown
                    components={{
                      code({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: {
                        node?: any;
                        inline?: boolean;
                        className?: string;
                        children?: React.ReactNode;
                      }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {entry.response}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
            <form
              className="flex flex-row gap-1 mt-2"
              onSubmit={handleQuerySubmit}
            >
              <input
                type="text"
                className="w-full h-10 border border-black rounded p-2"
                placeholder="Ask me anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white w-10 h-10 rounded flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
