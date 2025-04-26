import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const TeamMemberDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/employees/${id}`)
      .then(response => response.json())
      .then(data => setEmployee(data))
      .catch(error => console.error("Veri getirilemedi:", error));
  }, [id]);

  if (!employee) return <p className="text-center">Yükleniyor...</p>;

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-center">{employee.name} {employee.surname}</h1>
      <p className="text-center">{employee.role}</p>
      <p className="text-center">{employee.email}</p>
    </div>
  );
};

export default TeamMemberDetail;
