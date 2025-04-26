// clients/src/components/ChatWidget.js
import React, { useState } from "react";
import ChatBox from "./ChatBox";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
    }}>
      {open && (
        <div style={{
          width: "300px",
          height: "400px",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          padding: "10px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>💬 Ekip İçi Sohbet</strong>
            <button onClick={() => setOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✖</button>
          </div>
          <ChatBox />
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
