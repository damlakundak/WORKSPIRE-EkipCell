<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ recipient, isGroup }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  const username = localStorage.getItem("userEmail");
  const department = localStorage.getItem("userDepartment");

  // Mesaj geçmişini yükle (grup veya bireysel)
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (isGroup) {
          const res = await fetch(`http://localhost:5000/api/messages/group?department=${department}`)
                                  .then(res => res.json())
                                  .then(setMessages);
          const data = await res.json();
          if (Array.isArray(data)) setMessages(data);
          else {
            console.error("Beklenmeyen grup mesaj verisi:", data);
            setMessages([]);
          }
        } else if (recipient) {
          const res = await fetch(`http://localhost:5000/api/messages/private?user1=${username}&user2=${recipient.email}`);
          const data = await res.json();
          if (Array.isArray(data)) setMessages(data);
          else {
            console.error("Beklenmeyen bireysel mesaj verisi:", data);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Mesajlar alınamadı:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipient, isGroup]);

  // Yeni gelen mesajları dinle
  useEffect(() => {
    const handleIncoming = (msg) => {
      if (isGroup) {
        if (!msg.is_private && msg.department === department) {
          setMessages((prev) => [...prev, msg]);
        }
      } else if (recipient) {
        const isMine = msg.username === username && msg.recipient_email === recipient.email;
        const isFromThem = msg.username === recipient.email && msg.recipient_email === username;
        if (msg.is_private && (isMine || isFromThem)) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    socket.on("receiveMessage", handleIncoming);
    return () => socket.off("receiveMessage", handleIncoming);
  }, [recipient, isGroup]);

  // Mesaj gönder
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        username,
        content: input,
        department,
        is_private: !isGroup,
        recipient_email: isGroup ? "" : recipient.email,
      });
      setInput("");
    }
  };

  // Scroll to bottom on message update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const title = isGroup ? "💬 Ekip Sohbeti" : `${recipient.name} (${recipient.email})`;

  return (
    <div className="h-full flex flex-col">
      {/* Başlık */}
      <div className="p-4 border-b font-semibold text-lg bg-white">{title}</div>

      {/* Mesajlar */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 italic">Henüz mesaj yok.</div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} isOwn={msg.username === username} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mesaj yazma alanı */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 p-2 rounded border"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
=======
import { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ recipient, isGroup }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  const username = localStorage.getItem("userEmail");
  const department = localStorage.getItem("userDepartment");

  // Mesaj geçmişini yükle (grup veya bireysel)
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (isGroup) {
          const res = await fetch(`http://localhost:5000/api/messages/group?department=${department}`)
                                  .then(res => res.json())
                                  .then(setMessages);
          const data = await res.json();
          if (Array.isArray(data)) setMessages(data);
          else {
            console.error("Beklenmeyen grup mesaj verisi:", data);
            setMessages([]);
          }
        } else if (recipient) {
          const res = await fetch(`http://localhost:5000/api/messages/private?user1=${username}&user2=${recipient.email}`);
          const data = await res.json();
          if (Array.isArray(data)) setMessages(data);
          else {
            console.error("Beklenmeyen bireysel mesaj verisi:", data);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Mesajlar alınamadı:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [recipient, isGroup]);

  // Yeni gelen mesajları dinle
  useEffect(() => {
    const handleIncoming = (msg) => {
      if (isGroup) {
        if (!msg.is_private && msg.department === department) {
          setMessages((prev) => [...prev, msg]);
        }
      } else if (recipient) {
        const isMine = msg.username === username && msg.recipient_email === recipient.email;
        const isFromThem = msg.username === recipient.email && msg.recipient_email === username;
        if (msg.is_private && (isMine || isFromThem)) {
          setMessages((prev) => [...prev, msg]);
        }
      }
    };

    socket.on("receiveMessage", handleIncoming);
    return () => socket.off("receiveMessage", handleIncoming);
  }, [recipient, isGroup]);

  // Mesaj gönder
  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", {
        username,
        content: input,
        department,
        is_private: !isGroup,
        recipient_email: isGroup ? "" : recipient.email,
      });
      setInput("");
    }
  };

  // Scroll to bottom on message update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const title = isGroup ? "💬 Ekip Sohbeti" : `${recipient.name} (${recipient.email})`;

  return (
    <div className="h-full flex flex-col">
      {/* Başlık */}
      <div className="p-4 border-b font-semibold text-lg bg-white">{title}</div>

      {/* Mesajlar */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-2">
        {loading ? (
          <div className="text-center text-gray-500">Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 italic">Henüz mesaj yok.</div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} isOwn={msg.username === username} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mesaj yazma alanı */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 p-2 rounded border"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
>>>>>>> b85cb3890da80408a738bc71e4f4e189328dcc47
