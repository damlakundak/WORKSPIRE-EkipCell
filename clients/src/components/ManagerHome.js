// frontend/src/components/ManagerHome.js

import React, { useState, useEffect } from "react";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaTrash, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Tıpkı Dashboard gibi
import axios from "axios";

function ManagerHome() {
  // To-Do list (sol kısım)
  const [personalTasks, setPersonalTasks] = useState([]);
  const [newPersonalTask, setNewPersonalTask] = useState("");

  // Çalışanlar + Görev atama (sağ kısım)
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [newTask, setNewTask] = useState({ task_name: "", task_description: "", deadline: "", score: "" });

  // Ortak Dashboard state’leri
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("tr");

  // Manager id
  const managerId = localStorage.getItem("employeeId") || "";
  const navigate = useNavigate();

  // Effect: manager id ile çalışanları çek
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
        // Burada employeeId yerine managerId kontrol ediliyor
        const managerId = localStorage.getItem("employeeId");  

        if (!managerId) {
            alert("Yönetici ID'si bulunamadı. Lütfen yeniden giriş yapın.");
            return;
        }

        // Backend URL’i doğru ayarlanmış mı kontrol et!
        const response = await axios.get(`http://localhost:5000/employees/manager/${managerId}`);
        
        if (response.data) {
            console.log("Çalışanlar: ", response.data);  // Konsolda çalışanları göster
            setEmployees(response.data);
        }
    } catch (error) {
        console.error("Çalışanlar getirilemedi: ", error);
        alert("Çalışanlar yüklenemedi. Lütfen sunucunun çalıştığından emin olun.");
    }
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewTask(prevTask => ({
    ...prevTask,
    [name]: value
  }));
}


  // To-Do List (sol kısım) fonksiyonları
  const addPersonalTask = () => {
    if (newPersonalTask.trim() !== "") {
      setPersonalTasks(prev => [...prev, { id: prev.length + 1, title: newPersonalTask, completed: false }]);
      setNewPersonalTask("");
    }
  };
  const togglePersonalTask = (id) => {
    setPersonalTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };
  const removePersonalTask = (id) => {
    setPersonalTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleTaskCreate = async () => {
    if (!selectedEmployeeId) {
      alert("Lütfen bir çalışan seçin.");
      return;
    }
    try {
      const managerId = localStorage.getItem("employeeId");  // Manager ID'sini al

      const response = await axios.post("http://localhost:5000/employees/assign-task", {  // URL düzeltildi
        employee_id: selectedEmployeeId,
        manager_id: managerId,
        task_name: newTask.task_name,
        task_description: newTask.task_description,
        deadline: newTask.deadline,
        score: newTask.score || 0, 
      });

      if (response.data.message) {
        alert(response.data.message);
        setNewTask({ task_name: "", task_description: "", deadline: "", score: "" });
        setSelectedEmployeeId("");
      }
    } catch (error) {
      console.error("Görev atanamadı:", error);
      alert("Görev atanamadı. Sunucu hatası.");
    }
  };


  // Dil çevirileri (Dashboard’daki gibi)
  const translations = {
    tr: {
      search: "Ara...",
      newTask: "Yeni görev ekle...",
      personalTasks: "Kişisel Görevler",
      assignedTasks: "Görev Atama Paneli",
    },
    en: {
      search: "Search...",
      newTask: "Add new task...",
      personalTasks: "Personal Tasks",
      assignedTasks: "Task Assignment Panel",
    },
  };

  return (
    <div className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-900"} h-screen p-6 relative flex`}>
      {/* Sidebar (Dashboard ile aynı) */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 shadow-lg z-50`}>
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </button>
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} darkMode={darkMode} language={language} />
      </div>

      <div className="flex flex-col flex-grow">
        {/* İçerik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Sol: Bireysel To-Do List */}
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-yellow-100 text-gray-900"}`}>
            <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].personalTasks}</h2>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newPersonalTask}
                onChange={(e) => setNewPersonalTask(e.target.value)}
                placeholder={translations[language].newTask}
                className="w-full px-4 py-2 border rounded-full focus:outline-none shadow-sm"
              />
              <button
                onClick={addPersonalTask.bind(null, setPersonalTasks, setNewPersonalTask, newPersonalTask)}
                className="px-4 py-2 rounded-full bg-blue-600 text-white"
              >
                ➕
              </button>
            </div>

            <ul>
              {personalTasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center p-2 border-b">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => togglePersonalTask(task.id)}
                    className="cursor-pointer"
                  />
                  <span className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</span>
                  <FaTrash
                    onClick={() => setPersonalTasks(prev => prev.filter(t => t.id !== task.id))}
                    className="cursor-pointer text-red-500"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ: Görev Atama Paneli */}
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-900"}`}>
            <h2 className="text-2xl font-semibold mb-4 text-center">{translations[language].assignedTasks}</h2>

            {/* Çalışan Seçimi */}
            <select 
                onChange={e => setSelectedEmployeeId(e.target.value)} 
                value={selectedEmployeeId || ""} 
                className="p-2 border rounded mb-2 w-full"
            >
                <option value="">Çalışan Seç</option>
                {employees.length > 0 ? (
                    employees.map(employee => (
                        <option key={employee.employee_id} value={employee.employee_id}>
                            {employee.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Çalışan bulunamadı</option>
                )}
            </select>


            {/* Görev Adı */}
            <input
              name="task_name"
              placeholder="Görev Adı"
              value={newTask.task_name}
              onChange={handleInputChange}
              className="p-2 border rounded mb-2 w-full"
            />

            {/* Görev Açıklaması */}
            <textarea
              name="task_description"
              placeholder="Görev Açıklaması"
              value={newTask.task_description}
              onChange={handleInputChange}
              className="p-2 border rounded mb-2 w-full"
              rows="3"
            ></textarea>

            {/* Tarih + Puan */}
            <div className="flex gap-4 mb-2">
              <input
                name="deadline"
                type="date"
                value={newTask.deadline}
                onChange={handleInputChange}
                className="p-2 border rounded w-1/2"
              />
              <input
                name="score"
                placeholder="Görev Puanı"
                value={newTask.score}
                onChange={handleInputChange}
                className="p-2 border rounded w-1/2"
              />
            </div>

            {/* Görev Ekle Butonu */}
            <button
              onClick={handleTaskCreate}
              className="w-full p-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Görev Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerHome;
