import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import "dayjs/locale/en";

const TaskCalendar = () => {
  const { darkMode, language } = useOutletContext();
  const [viewMode, setViewMode] = useState("personal");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month());
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [currentWeek, setCurrentWeek] = useState(dayjs().year(selectedYear).month(selectedMonth).startOf("week"));
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingParticipants, setNewMeetingParticipants] = useState("");
  const [newTaskDate, setNewTaskDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [newTaskTime, setNewTaskTime] = useState("12:00");
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const translations = {
    tr: {
      calendar: "Genel Görevli Takvim",
      addTask: "Görev Ekle",
      addMeeting: "Toplantı Ekle",
      taskTitle: "Görev Konusu",
      meetingTitle: "Toplantı Konusu",
      meetingParticipants: "Katılımcılar",
      taskDate: "Gün Seç",
      taskTime: "Saat Seç",
      personal: "Bireysel Takvim",
      team: "Ekip Takvimi",
      days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
      months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
    },
    en: {
      calendar: "General Task Calendar",
      addTask: "Add Task",
      addMeeting: "Add Meeting",
      taskTitle: "Task Title",
      meetingTitle: "Meeting Title",
      meetingParticipants: "Participants",
      taskDate: "Select Date",
      taskTime: "Select Time",
      personal: "Personal Calendar",
      team: "Team Calendar",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  };

  useEffect(() => {
    setCurrentWeek(dayjs().locale(language).year(selectedYear).month(selectedMonth).startOf("week"));
  }, [selectedMonth, selectedYear, language]);

  const getWeekDays = () => {
    return [...Array(7)].map((_, i) => currentWeek.add(i, "day").format("YYYY-MM-DD"));
  };

  const previousWeek = () => setCurrentWeek(currentWeek.subtract(1, "week"));
  const nextWeek = () => setCurrentWeek(currentWeek.add(1, "week"));

  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    const newTask = {
      id: tasks.length + 1,
      date: newTaskDate,
      time: newTaskTime,
      title: newTaskTitle
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const addMeeting = () => {
    if (newMeetingTitle.trim() === "" || newMeetingParticipants.trim() === "") return;
    const newMeeting = {
      id: meetings.length + 1,
      date: newTaskDate,
      time: newTaskTime,
      title: newMeetingTitle,
      participants: newMeetingParticipants
    };
    setMeetings([...meetings, newMeeting]);
    setNewMeetingTitle("");
    setNewMeetingParticipants("");
  };

  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"}`}>
      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <button className={`px-6 py-2 rounded-l-lg ${viewMode === "personal" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("personal")}>
          {translations[language].personal}
        </button>
        <button className={`px-6 py-2 rounded-r-lg ${viewMode === "team" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setViewMode("team")}>
          {translations[language].team}
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">{translations[language].calendar}</h1>

      {/* Ay / Yıl */}
      <div className="flex justify-center items-center gap-6 mb-6">
        <button className="p-2 bg-blue-600 text-white rounded" onClick={previousWeek}><FaChevronLeft /></button>
        <select className="p-2 rounded text-black" value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
          {translations[language].months.map((month, i) => <option key={i} value={i}>{month}</option>)}
        </select>
        <select className="p-2 rounded text-black" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
          {Array.from({ length: 5 }, (_, i) => {
            const y = dayjs().year() - 2 + i;
            return <option key={i} value={y}>{y}</option>;
          })}
        </select>
        <button className="p-2 bg-blue-600 text-white rounded" onClick={nextWeek}><FaChevronRight /></button>
      </div>

      {/* Takvim + Ekle */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Takvim */}
        <div className={`flex-1 p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <div className="grid grid-cols-7 gap-3">
            {getWeekDays().map((day, i) => (
              <div key={day} className="bg-white text-black rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-semibold">{dayjs(day).format("DD")} {translations[language].days[i]}</h3>
                <ul className="mt-1 text-xs">
                  {[...(tasks.filter(t => t.date === day)), ...(meetings.filter(m => m.date === day))].map(item => (
                    <li key={item.id} className="bg-gray-200 p-1 mt-1 rounded">
                      {item.time} - {item.title} {item.participants ? `(${item.participants})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Ekleme Alanı */}
        <div className={`w-full lg:w-1/4 p-6 rounded-lg shadow-md ${darkMode ? "bg-blue-900 text-white" : "bg-yellow-100 text-gray-900"}`}>
          <h3 className="text-lg font-bold mb-3">
            {viewMode === "personal" ? translations[language].addTask : translations[language].addMeeting}
          </h3>
          <input className="w-full mb-2 p-2 border rounded text-black" type="text"
            placeholder={viewMode === "personal" ? translations[language].taskTitle : translations[language].meetingTitle}
            value={viewMode === "personal" ? newTaskTitle : newMeetingTitle}
            onChange={(e) => viewMode === "personal" ? setNewTaskTitle(e.target.value) : setNewMeetingTitle(e.target.value)} />
          {viewMode === "team" && (
            <input className="w-full mb-2 p-2 border rounded text-black" type="text"
              placeholder={translations[language].meetingParticipants}
              value={newMeetingParticipants}
              onChange={(e) => setNewMeetingParticipants(e.target.value)} />
          )}
          <input className="w-full mb-2 p-2 border rounded text-black" type="date" value={newTaskDate} onChange={(e) => setNewTaskDate(e.target.value)} />
          <input className="w-full mb-2 p-2 border rounded text-black" type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} />
          <button onClick={viewMode === "personal" ? addTask : addMeeting}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2 flex justify-center items-center">
            <FaPlus className="mr-2" />
            {viewMode === "personal" ? translations[language].addTask : translations[language].addMeeting}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;
