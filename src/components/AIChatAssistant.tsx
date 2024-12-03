"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";

const AIChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const { BACKEND_URL } = useConstants();
  const { token, user } = useAuth();

  useEffect(() => {
    const storedHistory = localStorage.getItem("aiChatHistory");
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("aiChatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const fetchAiResponse = async (query: string) => {
    setLoading(true);
    setCurrentResponse(""); // Clear current response for the new query
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
      displayResponseWordByWord(data.markdown); // Process response with word-by-word effect
      setChatHistory((prev) => [...prev, { query, response: data.markdown }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      displayResponseWordByWord("**Error:** Unable to fetch AI response.");
    } finally {
      setLoading(false);
    }
  };

  const displayResponseWordByWord = (response: string) => {
    const words = response.split(" ");
    let currentWordIndex = 0;

    const typeWord = () => {
      if (currentWordIndex < words.length) {
        setCurrentResponse((prev) => prev + words[currentWordIndex] + " ");
        currentWordIndex++;
        setTimeout(typeWord, 100); // Typing speed in milliseconds
      }
    };

    setCurrentResponse(""); // Clear previous response
    typeWord(); // Start the typing effect
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
          className={`fixed bottom-5 right-5 lg:bottom-10 lg:right-10 grid place-items-center border shadow-2xl w-[3rem] h-[3rem] p-1 bg-blue-200 rounded-full hover:bg-blue-300 transform ${
            open ? "rotate-45" : "rotate-0"
          } transition-transform duration-300`}
        >
          <FontAwesomeIcon icon={faRobot} className="text-2xl text-gray-800" />
        </button>
        <div
          className={`fixed bottom-20 lg:bottom-24 right-5 lg:right-10 z-50 w-80 transition-all duration-300 ${
            open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
          }`}
          style={{
            transformOrigin: "top right",
            transitionProperty: "transform, opacity",
          }}
        >
          {open && (
            <div className="p-[1rem] shadow-xl bg-gray-200 border border-black rounded">
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

              <div className="mt-4 max-h-80 overflow-auto border-t border-gray-400 pt-2">
                {chatHistory.map((entry, index) => (
                  <div key={index} className="mb-3">
                    <p className="font-semibold">You:</p>
                    <p className="bg-white p-2 rounded border">{entry.query}</p>
                    <p className="font-semibold mt-2">AI:</p>
                    <ReactMarkdown>{entry.response}</ReactMarkdown>
                  </div>
                ))}
                {loading && (
                  <div className="mb-3">
                    <p className="font-semibold">AI is typing...</p>
                    <ReactMarkdown>{currentResponse}</ReactMarkdown>
                  </div>
                )}
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
    </div>
  );
};

export default AIChatAssistant;
