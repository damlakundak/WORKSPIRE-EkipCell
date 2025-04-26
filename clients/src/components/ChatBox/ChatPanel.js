<<<<<<< HEAD
import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import NewChatModal from "./NewChatModal";

const ChatPanel = () => {
    
  const [activeChat, setActiveChat] = useState(null); // { type: "group" } veya { type: "private", user: {...} }
  const [previousContacts, setPreviousContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Mesaj geçmişinden kimlerle konuşulduysa onları getir
    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(data => {
        const contacts = data
          .filter(msg =>
            msg.is_private &&
            (msg.username === currentUserEmail || msg.recipient_email === currentUserEmail)
          )
          .map(msg => (msg.username === currentUserEmail ? msg.recipient_email : msg.username));

        const uniqueEmails = [...new Set(contacts)];

        // Kullanıcı bilgilerini e-posta ile eşle
        fetch("http://localhost:5000/employees")
          .then(res => res.json())
          .then(allUsers => {
            const filtered = allUsers.filter(user => uniqueEmails.includes(user.email));
            setPreviousContacts(filtered);
          });
      });
  }, []);

  // ✨ Yeni bireysel sohbet
  const handleStartPrivateChat = (user) => {
    setActiveChat({ type: "private", user });
    setShowModal(false);
  };


  return (
    <div className="w-full h-screen flex">
      {/* Sol Panel */}
      <div className="w-1/3 min-w-[250px] max-w-[300px] bg-white border-r overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Sohbetler</h2>
          <button
            className="text-blue-600 font-bold text-sm underline"
            onClick={() => setShowModal(true)}
          >
            + Yeni
          </button>
        </div>

        {/* Ekip Sohbeti kutusu */}
        <div
          className={`p-3 mb-4 rounded-lg cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300`}
          onClick={() => setActiveChat({ type: "group" })}
        >
          💬 Ekip Sohbeti
        </div>

        {/* Bireysel konuşmalar */}
        <ul className="space-y-2">
          {previousContacts.map(user => (
            <li
              key={user.employee_id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
                activeChat?.user?.email === user.email ? "bg-blue-100 border-blue-400" : "border-gray-300"
              }`}
              onClick={() => setActiveChat({ type: "private", user })}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ Panel */}
      <div className="flex-1 bg-gray-50 relative">
        {activeChat ? (
          <ChatWindow
            recipient={activeChat.type === "group" ? null : activeChat.user}
            isGroup={activeChat.type === "group"}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Sohbete başlamak için kişi/grup seç
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <NewChatModal
            onClose={() => setShowModal(false)}
            onStartPrivateChat={handleStartPrivateChat}
        />
        )}

    </div>
  );
};

export default ChatPanel;

=======
import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import NewChatModal from "./NewChatModal";

const ChatPanel = () => {
    
  const [activeChat, setActiveChat] = useState(null); // { type: "group" } veya { type: "private", user: {...} }
  const [previousContacts, setPreviousContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Mesaj geçmişinden kimlerle konuşulduysa onları getir
    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(data => {
        const contacts = data
          .filter(msg =>
            msg.is_private &&
            (msg.username === currentUserEmail || msg.recipient_email === currentUserEmail)
          )
          .map(msg => (msg.username === currentUserEmail ? msg.recipient_email : msg.username));

        const uniqueEmails = [...new Set(contacts)];

        // Kullanıcı bilgilerini e-posta ile eşle
        fetch("http://localhost:5000/employees")
          .then(res => res.json())
          .then(allUsers => {
            const filtered = allUsers.filter(user => uniqueEmails.includes(user.email));
            setPreviousContacts(filtered);
          });
      });
  }, []);

  // ✨ Yeni bireysel sohbet
  const handleStartPrivateChat = (user) => {
    setActiveChat({ type: "private", user });
    setShowModal(false);
  };


  return (
    <div className="w-full h-screen flex">
      {/* Sol Panel */}
      <div className="w-1/3 min-w-[250px] max-w-[300px] bg-white border-r overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Sohbetler</h2>
          <button
            className="text-blue-600 font-bold text-sm underline"
            onClick={() => setShowModal(true)}
          >
            + Yeni
          </button>
        </div>

        {/* Ekip Sohbeti kutusu */}
        <div
          className={`p-3 mb-4 rounded-lg cursor-pointer bg-blue-100 hover:bg-blue-200 border border-blue-300`}
          onClick={() => setActiveChat({ type: "group" })}
        >
          💬 Ekip Sohbeti
        </div>

        {/* Bireysel konuşmalar */}
        <ul className="space-y-2">
          {previousContacts.map(user => (
            <li
              key={user.employee_id}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
                activeChat?.user?.email === user.email ? "bg-blue-100 border-blue-400" : "border-gray-300"
              }`}
              onClick={() => setActiveChat({ type: "private", user })}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Sağ Panel */}
      <div className="flex-1 bg-gray-50 relative">
        {activeChat ? (
          <ChatWindow
            recipient={activeChat.type === "group" ? null : activeChat.user}
            isGroup={activeChat.type === "group"}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Sohbete başlamak için kişi/grup seç
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <NewChatModal
            onClose={() => setShowModal(false)}
            onStartPrivateChat={handleStartPrivateChat}
        />
        )}

    </div>
  );
};

export default ChatPanel;

>>>>>>> b85cb3890da80408a738bc71e4f4e189328dcc47
