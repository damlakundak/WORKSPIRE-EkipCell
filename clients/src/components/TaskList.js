import { useEffect, useState } from "react";

const TaskList = ({ userId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/todos/${userId}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Görevler alınamadı:", err));
  }, [userId]);

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
      <h3 className="text-lg font-bold mb-2">To-Do List (Kişisel)</h3>
      <ul className="space-y-1">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.todo_id}>
              ✅ {task.title}
            </li>
          ))
        ) : (
          <li>Henüz görev yok</li>
        )}
      </ul>
    </div>
  );
};

export default TaskList;
