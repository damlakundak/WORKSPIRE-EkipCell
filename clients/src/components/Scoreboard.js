import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from "react-router-dom";

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [view, setView] = useState('company');
  const { darkMode, language } = useOutletContext();

  const loggedInUserId = parseInt(localStorage.getItem("employeeId"));
  const managerId = localStorage.getItem("managerId");

  const fetchScores = async () => {
    try {
      const url = view === 'company'
        ? '/scores/company'
        : `/scores/team/${managerId}`;

      const response = await axios.get(`http://localhost:5000${url}`);
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [view]);

  const translations = {
    tr: {
      company: "Şirket Geneli",
      team: "Ekip İçi"
    },
    en: {
      company: "Company-wide",
      team: "Team"
    }
  };

  return (
    <div className={`w-full p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setView('company')} 
          className={`px-4 py-2 rounded-full ${view === 'company' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
          {translations[language].company}
        </button>
        <button 
          onClick={() => setView('team')} 
          className={`px-4 py-2 rounded-full ${view === 'team' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'}`}>
          {translations[language].team}
        </button>
      </div>

      {/* İlk üç kullanıcı */}
      {scores.length > 0 && (
        <div className="flex justify-center items-end mb-10 gap-4">
          {[1, 0, 2].map((index) => scores[index] && (
            <div key={scores[index].employee_id} className={`text-center ${index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"}`}>
              <img
                src={scores[index].photo_url}
                alt={scores[index].name}
                className={`mx-auto object-cover rounded-full border-4 ${
                  index === 0 ? 'w-28 h-28 border-yellow-400' : 'w-20 h-20 border-gray-300'
                }`}
              />
              <h3 className="mt-2 font-semibold">{scores[index].name}</h3>
              <p className="font-bold">{scores[index].total_score}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tüm kullanıcılar tablo */}
      <table className="mx-auto w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
        <tbody>
          {scores.map((score, idx) => (
            <tr
              key={score.employee_id}
              className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"} ${
                score.employee_id === loggedInUserId ? "bg-yellow-400" : darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              } transition duration-300`}
            >
              <td className="px-4 py-2 font-semibold">{idx + 1}</td>
              <td className="px-4 py-2 flex items-center gap-3">
                <img src={score.photo_url} className="w-10 h-10 rounded-full object-cover"/>
                {score.name}
              </td>
              <td className="px-4 py-2 font-semibold text-right">{score.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
