// components/ChatBox/ChatContainer.js

import React, { useState, useEffect } from "react";
import socket from "../../socket"; // senin oluşturduğun socket.js dosyası
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState("group");
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);

  const username = localStorage.getItem("userEmail") || "Bilinmeyen";
  const department = localStorage.getItem("userDepartment") || "Genel";

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/messages`);
      const data = await res.json();
      setMessages(data);
      const uniqueUsers = Array.from(
        new Set(
          data
            .filter(
              (msg) =>
                msg.is_private &&
                (msg.username === username || msg.recipient_email === username)
            )
            .map((msg) =>
              msg.username === username
                ? msg.recipient_email
                : msg.username
            )
        )
      );
      setConversations(uniqueUsers);
    };

    fetchMessages();

    const handleNew = (data) => {
      setMessages((prev) => [...prev, data]);
      if (
        data.is_private &&
        (data.username === username || data.recipient_email === username)
      ) {
        const other =
          data.username === username
            ? data.recipient_email
            : data.username;
        setConversations((prev) =>
          prev.includes(other) ? prev : [...prev, other]
        );
      }
    };

    socket.on("receiveMessage", handleNew);

    return () => socket.off("receiveMessage", handleNew);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const isPrivate = selectedChat !== "group";
    const payload = {
      username,
      content: message,
      department,
      recipient_email: isPrivate ? selectedChat : null,
      is_private: isPrivate,
    };

    socket.emit("sendMessage", payload);
    setMessage("");
  };

  const filteredMessages = messages.filter((msg) => {
    if (msg.is_private) {
      return (
        (msg.username === username && msg.recipient_email === selectedChat) ||
        (msg.username === selectedChat && msg.recipient_email === username)
      );
    } else {
      return selectedChat === "group" && msg.department === department;
    }
  });

  return (
    <div style={{ display: "flex", width: "600px", height: "400px", border: "1px solid #aaa", borderRadius: "10px", overflow: "hidden" }}>
      <ChatSidebar
        conversations={conversations}
        selected={selectedChat}
        onSelect={setSelectedChat}
      />
      <ChatWindow
        messages={filteredMessages}
        selectedUser={selectedChat}
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};

export default ChatContainer;
