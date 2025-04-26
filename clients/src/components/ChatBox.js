import React, { useEffect, useState } from "react";
import socket from "../socket";

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("userEmail") || "Bilinmeyen";
  const department = localStorage.getItem("userDepartment") || "Genel";
  const [recipientEmail, setRecipientEmail] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages");
        const data = await res.json();
        setMessages(data); // mesajları yükle
      } catch (err) {
        console.error("Eski mesajlar alınamadı:", err);
      }
    };
  
    fetchMessages();

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };
  
    socket.on("receiveMessage", handleMessage);
  
    return () => {
      socket.off("receiveMessage", handleMessage); // sadece mesaj listener'ını kaldır
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const isPrivate = recipientEmail.trim() !== "";
  
      socket.emit("sendMessage", {
        username,
        content: message,
        department,
        recipient_email: recipientEmail.trim(),
        is_private: isPrivate,
      });
  
      setMessage("");
    }
  };
  
  

  return (
    <div className="w-[320px] h-[400px] bg-white text-black rounded-lg shadow-xl border border-gray-300 p-4 flex flex-col justify-between">
      <h3 className="text-lg font-bold mb-2">💬 Ekip İçi Chat</h3>

      <div style={{ height: "150px", overflowY: "scroll", marginBottom: "1rem" }}>
      {messages
        .filter((msg) => {
          if (msg.is_private) {
            // bireysel mesaj: ya ben göndericiyim ya da ben alıcıyım
            return (
              msg.username === username ||
              msg.recipient_email === username
            );
          } else {
            // grup mesaj: sadece departman eşleşirse
            return msg.department === department;
          }
        })
        .map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}</strong> [{new Date(msg.timestamp).toLocaleTimeString()}]: {msg.content}
          </div>
      ))}

      </div>
        <input
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="Kime? (e-posta)"
          className="w-full p-2 mb-2 rounded border border-gray-300"
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesaj yaz..."
          className="w-full p-2 mb-2 rounded border border-gray-300"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gönder
        </button>
    </div>
  );
};

export default ChatBox;
