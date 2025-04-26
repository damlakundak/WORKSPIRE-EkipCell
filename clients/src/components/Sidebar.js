import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ menuOpen, setMenuOpen, darkMode, language }) => {
  const navigate = useNavigate();

  const translations = {
    tr: {
      home:       "Anasayfa - ToDo",
      calendar:   "Genel Görevli Takvim",
      pomodoro:   "Pomodoro - Çalışma Saati Sıralama",
      scoreboard: "Puanlama Tablosu",
      game:       "Mini Oyun",
      team:       "Takım Arkadaşlarım",
    },
    en: {
      home:       "Home - ToDo",
      calendar:   "General Task Calendar",
      pomodoro:   "Pomodoro - Work Session Ranking",
      scoreboard: "Scoreboard",
      game:       "Mini Game",
      team:       "Team Members",
    }
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-800 text-white" : "bg-blue-900 text-white"} 
                  h-full w-64 fixed top-0 left-0 z-50`}
      style={{ transform: menuOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s" }}
    >
      {/* Kapat Butonu */}
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => setMenuOpen(false)}
      >
        <FaTimes />
      </button>

      {/* Menü Başlığı */}
      <h3 className="text-lg font-bold mt-10 px-6">Menü</h3>

      {/* Menü Butonları */}
      <nav className="mt-6 flex flex-col gap-4 px-6">
        {/* Home butonu: her tıklamada güncel değeri oku */}
        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            // taze olarak localStorage'dan oku
            const role = localStorage.getItem("__EKIPCELL_ROLE__");
            const target = role === "manager" ? "/manager" : "/home";
            navigate(target);
            setMenuOpen(false);
          }}
        >
          {translations[language].home}
        </button>

        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/calendar");
            setMenuOpen(false);
          }}
        >
          {translations[language].calendar}
        </button>

        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/pomodoro");
            setMenuOpen(false);
          }}
        >
          {translations[language].pomodoro}
        </button>

        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/scoreboard");
            setMenuOpen(false);
          }}
        >
          {translations[language].scoreboard}
        </button>

        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/game");
            setMenuOpen(false);
          }}
        >
          {translations[language].game}
        </button>

        <button
          className="text-left py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/team-members");
            setMenuOpen(false);
          }}
        >
          {translations[language].team}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
