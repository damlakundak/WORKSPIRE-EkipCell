<<<<<<< HEAD
import { useState, useEffect } from "react";

const NewChatModal = ({ onClose, onStartPrivateChat }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(user => user.email !== currentUserEmail);
        setAllUsers(filtered);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Yeni Bireysel Sohbet</h2>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="E-posta ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="max-h-[300px] overflow-y-auto space-y-1">
          {allUsers
            .filter(user => user.email.toLowerCase().includes(search.toLowerCase()))
            .map(user => (
              <li
                key={user.employee_id}
                className="cursor-pointer p-2 hover:bg-gray-100 border rounded"
                onClick={() => {
                  onStartPrivateChat(user);
                  onClose(); // otomatik modal kapansın
                }}
              >
                {user.name} ({user.email})
              </li>
            ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-blue-500 underline"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default NewChatModal;
=======
import { useState, useEffect } from "react";

const NewChatModal = ({ onClose, onStartPrivateChat }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(user => user.email !== currentUserEmail);
        setAllUsers(filtered);
      });
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Yeni Bireysel Sohbet</h2>

        <input
          className="w-full border p-2 rounded mb-2"
          placeholder="E-posta ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <ul className="max-h-[300px] overflow-y-auto space-y-1">
          {allUsers
            .filter(user => user.email.toLowerCase().includes(search.toLowerCase()))
            .map(user => (
              <li
                key={user.employee_id}
                className="cursor-pointer p-2 hover:bg-gray-100 border rounded"
                onClick={() => {
                  onStartPrivateChat(user);
                  onClose(); // otomatik modal kapansın
                }}
              >
                {user.name} ({user.email})
              </li>
            ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-blue-500 underline"
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default NewChatModal;
>>>>>>> b85cb3890da80408a738bc71e4f4e189328dcc47
