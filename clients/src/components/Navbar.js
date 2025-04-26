import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ChatBox from "./ChatBox";

const Navbar = ({ darkMode, setDarkMode, language, setLanguage, setMenuOpen }) => {
  const translations = {
    tr: { search: "Ara..." },
    en: { search: "Search..." }
  };
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <nav className={`top-4 left-2 right-2 flex justify-between items-center p-4 ${darkMode ? "bg-blue-800" : "bg-blue-900"} text-white shadow-md rounded-xl relative z-40`}>
      <div className="flex items-center gap-4">
        <button onClick={() => setMenuOpen(true)} className="text-2xl">
          <FaBars />
        </button>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={translations[language].search}
            className="w-full px-4 py-2 rounded-full text-black focus:outline-none shadow-md"
          />
          <FaSearch className="absolute right-3 top-3 text-gray-600" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <FaEnvelope
          className="text-2xl cursor-pointer"
          onClick={() => navigate("/messages")}
        />

        {chatOpen && (
          <div className="absolute right-4 top-16 md:right-8 z-50">
            <ChatBox />
          </div>
        )}


        <FaBell className="text-2xl cursor-pointer" />
        <FaUserCircle className="text-3xl cursor-pointer" />
        <button onClick={() => setDarkMode(!darkMode)} className="text-xl">
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-yellow-500" />}
        </button>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${language === "tr" ? "bg-yellow-500" : "bg-gray-500"}`}
            onClick={() => setLanguage("tr")}
          >
            TR
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${language === "en" ? "bg-yellow-500" : "bg-gray-500"}`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
