"use client";

import React, { useState } from "react";
// Fav icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const AIChatAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded fixed z-10 right-4 bottom-4 ">
      <div className="opacity-100">
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-5 right-5 lg:bottom-10 lg:right-10 grid place-items-center border shadow-2xl w-[3rem] h-[3rem] p-1 bg-blue-200 rounded-full hover:bg-blue-300"
        >
          {/* {creation} */}
          <FontAwesomeIcon icon={faRobot} className="text-2xl text-gray-800" />
        </button>
        {open && (
          <div className="fixed p-[1rem] bottom-20 lg:bottom-24 right-5 lg:right-10 z-50 shadow-xl bg-gray-200 border border-black rounded">
            <h2 className="text-lg font-semibold text-gray-800">
              AI Chat Assistant
            </h2>
            <div className="flex flex-row gap-1">
              <input
                type="text"
                className="w-full h-10 border border-black rounded p-2"
                placeholder="Ask me anything..."
              />
              <button className="bg-blue-500 text-white w-10 h-10 rounded ">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatAssistant;
