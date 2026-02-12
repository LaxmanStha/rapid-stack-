import React, { useState, useEffect } from "react";

export default function ExerciseDashboard() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("exerciseTodos");
    return saved ? JSON.parse(saved) : [];
  });

  const [preset, setPreset] = useState("");
  const [todoText, setTodoText] = useState("");
  const [todoTime, setTodoTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("exerciseTodos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const task = preset && preset !== "Other" ? preset : todoText;

    // Validation
    if (!task || typeof task !== "string") {
      setError("Task must be a valid string.");
      return;
    }
    if (!todoTime || isNaN(todoTime)) {
      setError("Time must be a number (minutes).");
      return;
    }

    setTodos([
      ...todos,
      {
        text: task,
        time: todoTime,
        done: false,
        date: new Date().toDateString(),
      },
    ]);
    setPreset("");
    setTodoText("");
    setTodoTime("");
    setError("");
  };

  const toggleTodo = (idx) => {
    const updated = [...todos];
    updated[idx].done = !updated[idx].done;
    setTodos(updated);
  };

  const resetAll = () => {
    setTodos([]);
    localStorage.removeItem("exerciseTodos");
  };

  // Weekly stats for chart
  const weeklyStats = todos.reduce((acc, todo) => {
    if (todo.done) {
      acc[todo.date] = (acc[todo.date] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 bg-green-50 min-h-screen">
      {/* Left Side: Todos + Controls */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-bold mb-4">📝 Exercise Todos</h2>

        {/* Dropdown + Form */}
        <div className="space-y-3">
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "#238b45" }}
          >
            <option value="">Select Preset Task</option>
            <option value="🏃 Run">🏃 Run</option>
            <option value="🏋️ Weights">🏋️ Weights</option>
            <option value="🧘 Yoga">🧘 Yoga</option>
            <option value="🚴 Cycling">🚴 Cycling</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Custom Task (e.g. Pushups)"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            disabled={preset && preset !== "Other"}
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "#238b45" }}
          />

          <input
            type="number"
            placeholder="Time (minutes)"
            value={todoTime}
            onChange={(e) => setTodoTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "#238b45" }}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between">
            <button
              onClick={addTodo}
              className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90"
              style={{ backgroundColor: "#238b45" }}
            >
              ➕ Add Todo
            </button>
            <button
              onClick={resetAll}
              className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90"
              style={{ backgroundColor: "#ef4444" }}
            >
              🔄 Reset All
            </button>
          </div>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Plan your workout 📝!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo, idx) => (
              <li key={idx} className="flex items-center gap-2 border-b pb-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(idx)}
                  className="accent-green-600"
                />
                <span
                  className={
                    todo.done ? "line-through text-gray-500" : "text-gray-800"
                  }
                >
                  {todo.text} ({todo.time} min)
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side: Daywise Progress Graph */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📊 Weekly Todo Progress</h2>
        {Object.keys(weeklyStats).length === 0 ? (
          <p className="text-gray-500">No completed todos yet.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(weeklyStats).map(([day, count], idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <span>{day}</span>
                  <span style={{ color: "#238b45" }}>{count} ✅</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-4">
                  <div
                    className="h-4 rounded"
                    style={{
                      width: `${count * 20}%`,
                      backgroundColor: "#238b45",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
