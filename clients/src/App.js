import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ManagerHome from "./components/ManagerHome";
import Layout from "./components/Layout";
import TaskCalendar from "./components/Calendar";
import TeamMembers from "./components/TeamMembers";
import TeamMemberDetail from "./components/TeamMemberDetails";
import PomodoroTimer from "./components/Pomodoro";
import ChatPanel from "./components/ChatBox/ChatPanel";
import Scoreboard from "./components/Scoreboard";
import MemoryGame from "./components/MemoryGame";

function App() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const managerId = localStorage.getItem("managerId");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Eğer giriş yapılmışsa Layout açılır */}
        {isAuthenticated && (
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/calendar" element={<TaskCalendar />} />
            <Route path="/team-members" element={<TeamMembers />} />
            <Route path="/team-members/:id" element={<TeamMemberDetail />} />
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="/messages" element={<ChatPanel />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            <Route path="/game" element={<MemoryGame />} />
            <Route path="/manager" element={managerId === "1" ? <ManagerHome /> : <Navigate to="/home" />} />
          </Route>
        )}

        {/* Giriş yapılmamışsa her şeyi login ekranına yönlendir */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
