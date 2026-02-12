
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = `http://localhost/RSB/api`;

export default function WaterTracker() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [customAmount, setCustomAmount] = useState("");
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [total, setTotal] = useState(0);

  // Fetch water intake entries from API on component mount
  useEffect(() => {
    if (token) {
      fetchWaterEntries();
    }
  }, [token]);

  const fetchWaterEntries = async () => {
    try {
      const response = await fetch(`${API_BASE}/water_intake.php?token=${token}`);
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        calculateTotal(data.data);
      } else {
        console.error("Failed to fetch water entries:", data.error);
      }
    } catch (error) {
      console.error("Error fetching water entries:", error);
    }
  };

  const calculateTotal = (entries) => {
    const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
    setTotal(totalAmount);
  };

  const addEntryAPI = async (amount) => {
    try {
      const response = await fetch(`${API_BASE}/water_intake.php?token=${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          time: new Date().toLocaleTimeString(),
          date: new Date().toISOString().split('T')[0], // Use YYYY-MM-DD format
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchWaterEntries(); // Refresh entries
      } else {
        console.error("Failed to add water entry:", data.error);
      }
    } catch (error) {
      console.error("Error adding water entry:", error);
    }
  };

  const deleteEntryAPI = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/water_intake.php?id=${id}&token=${token}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to delete water entry:", data.error);
      }
    } catch (error) {
      console.error("Error deleting water entry:", error);
    }
  };

  const addEntry = async (amount) => {
    if (!amount) return;
    await addEntryAPI(amount);
  };

  const deleteEntry = async (id) => {
    await deleteEntryAPI(id);
    await fetchWaterEntries(); // Refresh entries
  };

  const progress = Math.min((total / dailyGoal) * 100, 100);

  return (
    <div className="flex gap-6 p-6 bg-green-50 min-h-screen">
      {/* Left side */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">🌿 Today's Progress</h2>
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-32 h-32 rounded-full border-4 flex items-center justify-center text-lg font-bold"
            style={{ borderColor: "#238b45", color: "#238b45" }}
          >
            {Math.round(progress)}%
          </div>
          <p className="mt-2" style={{ color: "#238b45" }}>
            💧 {total} ml of {dailyGoal} ml
          </p>
        </div>

        {/* Quick Add */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[250, 500, 750, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => addEntry(amt)}
              className="text-white py-2 rounded hover:opacity-90"
              style={{ backgroundColor: "#238b45" }}
            >
              +{amt} ml
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Custom Amount (ml)"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2"
            style={{ borderColor: "#238b45" }}
          />
          <input
            type="number"
            placeholder="Daily Goal (ml)"
            value={dailyGoal}
            onChange={(e) => setDailyGoal(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 focus:ring-2"
            style={{ borderColor: "#238b45" }}
          />
          <button
            onClick={() => {
              addEntry(Number(customAmount));
              setCustomAmount("");
            }}
            className="w-full text-white py-2 rounded hover:opacity-90"
            style={{ backgroundColor: "#238b45" }}
          >
            ➕ Add Entry
          </button>
        </div>
      </div>

      {/* Right side: Logs */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📜 Recent Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500">
            No logs yet. Start tracking your water intake 💧!
          </p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="border-b pb-2 flex items-center justify-between"
                style={{ color: "#238b45" }}
              >
                <span>
                  <span className="font-semibold">💧 {log.amount} ml</span> –{" "}
                  {new Date(`2000-01-01 ${log.time}`).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => deleteEntry(log.id)}
                  className="ml-4 text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete entry"
                >
                  🗑️ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
