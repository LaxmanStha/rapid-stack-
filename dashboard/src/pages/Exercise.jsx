import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = `http://localhost/RSB/api`;

export default function ExerciseDashboard() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);

  const [preset, setPreset] = useState("");
  const [todoText, setTodoText] = useState("");
  const [todoTime, setTodoTime] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  // Fetch todos from API on component mount
  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_BASE}/exercise_todos.php?token=${token}`);
      const data = await response.json();
      if (data.success) {
        setTodos(data.data);
      } else {
        console.error("Failed to fetch todos:", data.error);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodoAPI = async (task, time) => {
    try {
      const response = await fetch(`${API_BASE}/exercise_todos.php?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: task,
          time: time,
          date: new Date().toDateString(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchTodos(); // Refresh todos
      } else {
        console.error("Failed to add todo:", data.error);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateTodoAPI = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/exercise_todos.php?id=${id}&token=${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to update todo:", data.error);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodoAPI = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/exercise_todos.php?id=${id}&token=${token}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to delete todo:", data.error);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#9966FF",
    "#FF9F40", "#4BC0C0", "#FF6B6B", "#C9CBCF",
    "#7C4DFF", "#00E676"
  ];



  const taskTimeMap = todos.reduce((acc, todo) => {
    if (todo.done) {
      acc[todo.text] = (acc[todo.text] || 0) + Number(todo.time);
    }
    return acc;
  }, {});
  const taskEntries = Object.entries(taskTimeMap);
  const totalTime = taskEntries.reduce((sum, [, t]) => sum + t, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 20;

    ctx.clearRect(0, 0, size, size);

    if (taskEntries.length === 0) return;

    let startAngle = -Math.PI / 2;

    taskEntries.forEach(([, time], idx) => {
      const slice = (time / totalTime) * 2 * Math.PI;
      const endAngle = startAngle + slice;
      const mid = startAngle + slice / 2;
      const color = COLORS[idx % COLORS.length];

      // Outer glow
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;

      // Gradient fill
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      gradient.addColorStop(0, lighten(color, 60));
      gradient.addColorStop(0.6, color);
      gradient.addColorStop(1, darken(color, 30));

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // White separator
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "transparent";
      ctx.stroke();
      ctx.restore();

      // Percentage label
      if (slice > 0.4) {
        const lx = cx + radius * 0.6 * Math.cos(mid);
        const ly = cy + radius * 0.6 * Math.sin(mid);

        // Text shadow
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${((time / totalTime) * 100).toFixed(0)}%`, lx, ly);
        ctx.restore();
      }

      startAngle = endAngle;
    });

    // Donut hole with gradient
    const holeGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 0.38);
    holeGradient.addColorStop(0, "#ffffff");
    holeGradient.addColorStop(1, "#f8f8f8");

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.38, 0, 2 * Math.PI);
    ctx.fillStyle = holeGradient;
    ctx.fill();
    ctx.restore();

    // Center text
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${totalTime}`, cx, cy - 10);
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#999";
    ctx.fillText("minutes", cx, cy + 10);
  }, [taskEntries, totalTime]);

  function lighten(hex, amt) {
    let num = parseInt(hex.replace("#", ""), 16);
    let r = Math.min(255, (num >> 16) + amt);
    let g = Math.min(255, ((num >> 8) & 0xff) + amt);
    let b = Math.min(255, (num & 0xff) + amt);
    return `rgb(${r},${g},${b})`;
  }

  function darken(hex, amt) {
    let num = parseInt(hex.replace("#", ""), 16);
    let r = Math.max(0, (num >> 16) - amt);
    let g = Math.max(0, ((num >> 8) & 0xff) - amt);
    let b = Math.max(0, (num & 0xff) - amt);
    return `rgb(${r},${g},${b})`;
  }

  const addTodo = async () => {
    const task = preset && preset !== "Other" ? preset : todoText;

    if (!task || typeof task !== "string" || !task.trim()) {
      setError("Task must be a valid string.");
      return;
    }
    if (!todoTime || isNaN(todoTime) || Number(todoTime) <= 0) {
      setError("Time must be a positive number (minutes).");
      return;
    }

    await addTodoAPI(task, Number(todoTime));
    setPreset("");
    setTodoText("");
    setTodoTime("");
    setError("");
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateTodoAPI(id, { done: !todo.done });
      await fetchTodos(); // Refresh todos
    }
  };

  const resetAll = async () => {
    for (const todo of todos) {
      await deleteTodoAPI(todo.id);
    }
    setTodos([]);
  };

  const weeklyStats = todos.reduce((acc, todo) => {
    if (todo.done) {
      acc[todo.date] = (acc[todo.date] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 bg-green-50 min-h-screen">
      {/* Left Side */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-bold mb-4">📝 Exercise Todos</h2>

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

        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Plan your workout 📝!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-2 border-b pb-2">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
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

      {/* Right Side */}
      <div className="space-y-6">
        {/* Weekly Progress */}
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

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">🥧 Time Spent Per Task</h2>
          {taskEntries.length === 0 ? (
            <p className="text-gray-500">Complete todos to see pie chart.</p>
          ) : (
            <div className="flex flex-col items-center">
              <canvas ref={canvasRef} width={280} height={280} />

              <div className="mt-5 w-full space-y-3">
                {taskEntries.map(([task, time], idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] + "15" }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full inline-block shadow-sm"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {task}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: COLORS[idx % COLORS.length] }}
                      >
                        {time} min
                      </span>
                      <span className="text-xs text-gray-400">
                        ({((time / totalTime) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Time</span>
                  <span className="text-lg font-bold" style={{ color: "#333" }}>
                    🕐 {totalTime} min
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}