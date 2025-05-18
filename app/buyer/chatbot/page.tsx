"use client";

import { useState } from "react";

export default function ChatbotPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { sender: "User", message: userInput }]);

    try {
      // Send user input to the backend API
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await response.json();

      // Add chatbot response to chat history
      setChatHistory((prev) => [...prev, { sender: "Elaichi", message: data.response }]);
    } catch (error) {
      console.error("Error communicating with the chatbot:", error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "Gemini", message: "Sorry, I couldn't process your request. Please try again later." },
      ]);
    }

    // Clear user input
    setUserInput("");
  };

  return (
    <div className="chatbot-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>le’Elysian Virtual Assistant</h1>
      <div
        className="chat-history"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              textAlign: chat.sender === "User" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <strong>{chat.sender}:</strong> <span>{chat.message}</span>
          </div>
        ))}
      </div>
      <div className="chat-input" style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}