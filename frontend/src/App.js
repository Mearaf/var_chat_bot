import React, { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.png";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString();

    // Add user message to chat history
    setMessages([...messages, { sender: "user", text: input, time: timestamp }]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", { message: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data.response, time: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to the server.", time: timestamp },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src={logo} alt="Virginia Appliance Repair LLC" style={{ width: "150px" }} />
        <h1 style={{ color: "#d32f2f", fontSize: "24px", marginTop: "10px" }}>
          Virginia Appliance Repair Chatbot
        </h1>
      </div>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
              color: msg.sender === "user" ? "#0d47a1" : "#333",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
            <div style={{ fontSize: "12px", color: "#999" }}>{msg.time}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: "1",
            padding: "10px",
            border: "1px solid #d32f2f",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
