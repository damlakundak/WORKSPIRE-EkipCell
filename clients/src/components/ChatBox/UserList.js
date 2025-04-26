<<<<<<< HEAD
import { useEffect, useState } from "react";

const UserList = ({ activeUser, setActiveUser }) => {
  const [users, setUsers] = useState([]);
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Örnek veri – Gerçek projede backend'den çekilecek
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(data => {
        // Kendini listeden çıkar
        const filtered = data.filter(user => user.email !== currentUserEmail);
        setUsers(filtered);
      })
      .catch(err => console.error("Kullanıcı listesi alınamadı:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Sohbet Listesi</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user.employee_id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
              activeUser?.email === user.email ? "bg-blue-100 border-blue-400" : "border-gray-300"
            }`}
            onClick={() => setActiveUser(user)}
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
=======
import { useEffect, useState } from "react";

const UserList = ({ activeUser, setActiveUser }) => {
  const [users, setUsers] = useState([]);
  const currentUserEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Örnek veri – Gerçek projede backend'den çekilecek
    fetch("http://localhost:5000/employees")
      .then(res => res.json())
      .then(data => {
        // Kendini listeden çıkar
        const filtered = data.filter(user => user.email !== currentUserEmail);
        setUsers(filtered);
      })
      .catch(err => console.error("Kullanıcı listesi alınamadı:", err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Sohbet Listesi</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user.employee_id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 border ${
              activeUser?.email === user.email ? "bg-blue-100 border-blue-400" : "border-gray-300"
            }`}
            onClick={() => setActiveUser(user)}
          >
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
>>>>>>> b85cb3890da80408a738bc71e4f4e189328dcc47
