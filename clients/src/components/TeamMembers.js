import { useState, useEffect } from "react";
import { FaUserCircle, FaPhone } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";

const TeamMembers = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const { darkMode, language } = useOutletContext();

  const loggedInUserEmail = localStorage.getItem("userEmail");
  const loggedInUserDepartment = localStorage.getItem("userDepartment");

  useEffect(() => {
    if (!loggedInUserEmail) {
      setError("Giriş yapan kullanıcı bilgisi bulunamadı.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/employees/${loggedInUserEmail}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
          setFilteredEmployees(data);
        } else {
          setEmployees([]);
          setFilteredEmployees([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veriler getirilemedi:", error);
        setError("Veriler getirilemedi.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchQuery, employees]);

  const translations = {
    tr: {
      employees: "Takım Arkadaşlarım",
      search: "Ara...",
    },
    en: {
      employees: "Team Members",
      search: "Search...",
    }
  };

  if (loading) return <p className="text-center mt-24">Yükleniyor...</p>;
  if (error) return <p className="text-red-500 text-center mt-24">{error}</p>;

  const manager = filteredEmployees.find(emp => emp.manager_id === 1 && emp.department === loggedInUserDepartment);
  const otherEmployees = filteredEmployees.filter(emp => emp.manager_id !== 1 && emp.department === loggedInUserDepartment);

  return (
    <div className={`w-full pt-16 px-4 md:px-8 lg:px-16 ${darkMode ? "bg-[#0f172a] text-white" : "bg-white text-gray-900"} min-h-screen`}>
      <h1 className="text-2xl font-bold text-center mb-6">{translations[language].employees}</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder={translations[language].search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-full text-black shadow-md"
        />
      </div>

      {/* Yönetici Kartı */}
      {manager && (
        <div
          onClick={() => navigate(`/team-members/${manager.employee_id}`)}
          className={`w-full max-w-md mx-auto mb-8 p-6 rounded-lg shadow-md cursor-pointer transition ${
            darkMode ? "bg-blue-900 hover:bg-blue-800" : "bg-yellow-100 hover:bg-yellow-200"
          }`}
        >
          <img src={manager.photo_url || "https://via.placeholder.com/100"} alt={manager.name}
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover" />
          <h3 className="text-lg font-semibold text-center">{manager.name}</h3>
          <p className="text-sm text-center">{manager.department}</p>
          <p className="text-sm text-center mt-2 flex items-center justify-center gap-2">
            <FaPhone /> {manager.phone_number}
          </p>
        </div>
      )}

      {/* Diğer Çalışanlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {otherEmployees.map((employee) => (
          <div
            key={employee.employee_id}
            onClick={() => navigate(`/team-members/${employee.employee_id}`)}
            className={`p-4 rounded-lg shadow-md flex flex-col items-center cursor-pointer transition ${
              darkMode ? "bg-blue-900 hover:bg-blue-800" : "bg-yellow-100 hover:bg-yellow-200"
            }`}
          >
            <img src={employee.photo_url || "https://via.placeholder.com/80"} alt={employee.name}
              className="w-20 h-20 rounded-full mb-2 object-cover" />
            <h3 className="text-lg font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-400">{employee.department}</p>
            <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
              <FaPhone /> {employee.phone_number}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
