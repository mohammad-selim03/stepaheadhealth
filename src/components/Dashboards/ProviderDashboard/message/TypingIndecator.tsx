import React from "react";

interface TypingIndicatorProps {
  typingUsers: Set<string>;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.size === 0) return null;

  const getText = () => {
    if (typingUsers.size === 1) return "Someone is typing...";
    return `${typingUsers.size} people are typing...`;
  };

  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 animate-pulse">
        <div className="flex items-center gap-1">
          {getText()}
          <div className="flex gap-1 ml-2">
            <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};