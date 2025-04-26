import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";

const Pomodoro = () => {
  // Timer için başlangıç değeri (dakika * 60)
  const [sessions, setSessions] = useState([]);
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const { darkMode, language } = useOutletContext();
  const [customTime, setCustomTime] = useState(25); // Kullanıcının ayarladığı dakika
  const [scoreboard, setScoreboard] = useState([]); // Departmandaki tüm çalışanların toplam süreleri
  const [currentUser, setCurrentUser] = useState(null); // Giriş yapmış kullanıcı bilgisi
  const navigate = useNavigate();

  // Uygulama yüklendiğinde localStorage'den currentUser bilgilerini çekiyoruz
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    const department = localStorage.getItem("userDepartment");
    if (userId && email && department) {
      setCurrentUser({ userId, email, department });
    }
  }, []);

  // Timer işleyişi: Her saniye sayacı azalt, sıfıra ulaşınca completePomodoro'yu çağır
  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prev) => prev - 1), 1000);
    } else if (time === 0) {
      setIsRunning(false);
      console.log("Timer bitti. Süre:", customTime, "dakika.");
      completePomodoro(customTime);
      // Sayaç yeniden ayarlanıyor:
      setTime(customTime * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, time, customTime]);

  // Pomodoro tamamlandığında backend'e POST yapan fonksiyon
  const completePomodoro = async (completedMinutes) => {
    try {
      if (!currentUser) {
        console.warn("Kullanıcı bilgisi yok. Giriş yapılmamış.");
        return;
      }
  
      const employeeId = currentUser.userId;
  
      const response = await fetch("http://localhost:5000/api/pomodoro/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: employeeId,
          minutes: parseFloat(completedMinutes),
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Sunucuya Kaydedildi: ", data.message);
  
        // ➕ Yeni oturumu local state'e ekle
        setSessions((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            duration: `${completedMinutes} dk`,
          },
        ]);
  
        // 🔁 Departman tablosunu da güncelle
        fetchScoreboard();
      } else {
        console.error("Pomodoro kaydedilemedi: ", data.message);
      }
    } catch (err) {
      console.error("Hata: ", err);
    }
  };


  // Departman skor tablosunu API'den çekme fonksiyonu
  const fetchScoreboard = async () => {
    if (!currentUser) return;
    try {
      const dept = currentUser.department;
      console.log("Scoreboard çekiliyor, departman:", dept);
      const res = await fetch(`http://localhost:5000/api/pomodoro/scoreboard/${dept}`);
      const data = await res.json();
      console.log("Scoreboard verisi:", data);
      setScoreboard(data);
    } catch (err) {
      console.error("Skor tablosu çekme hatası:", err);
    }
  };

  // currentUser değiştiğinde scoreboard'u çekiyoruz
  useEffect(() => {
    fetchScoreboard();
  }, [currentUser]);

  // Saniyeyi dakika:saniye formatına çeviren fonksiyon
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const translations = {
    tr: {
      title: "Pomodoro Zamanlayıcı",
      setTime: "Süreyi Ayarla",
      workLog: "Departman Skoru",
      duration: "Süre"
    },
    en: {
      title: "Pomodoro Timer",
      setTime: "Set Time",
      workLog: "Department Score",
      duration: "Duration"
    }
  };

  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        
        {/* Sol: Sayaç */}
        <div className={`flex-1 p-8 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <div className="flex flex-col items-center">
            <img src="/assets/pomodoro.gif" alt="Pomodoro Timer" className="w-32 h-32 mb-4" />
            <h1 className="text-3xl font-bold mb-4">{translations[language].title}</h1>
            <input 
              type="number" 
              value={customTime} 
              onChange={(e) => setCustomTime(e.target.value)}
              className="border p-2 rounded mb-4 w-24 text-center text-black"
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded mb-4" 
              onClick={() => setTime(customTime * 60)}
            >
              {translations[language].setTime}
            </button>
            <h2 className="text-6xl font-bold mb-6">{formatTime(time)}</h2>
            <div className="flex justify-center gap-6">
              <button 
                className={`px-6 py-3 ${isRunning ? "bg-red-500" : "bg-green-500"} text-white rounded-full text-xl`} 
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <FaPause /> : <FaPlay />}
              </button>
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl" 
                onClick={() => { setIsRunning(false); setTime(customTime * 60); }}
              >
                <FaRedo />
              </button>
            </div>
          </div>
        </div>

              <div className={`w-full lg:w-1/3 p-8 rounded-2xl shadow-lg ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
        <h2 className="text-2xl font-bold mb-4">{translations[language].workLog}</h2>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Ad</th>
              <th className="border border-gray-300 px-4 py-2">Süre (dk)</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((person, idx) => (
              <tr key={person.employee_id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{idx + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{person.name}</td>
                <td className="border border-gray-300 px-4 py-2">{person.minutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>
    </div>
  );
};

export default Pomodoro;
