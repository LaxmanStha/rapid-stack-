
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function Dashboard() {
  const { token, user } = useAuth();
  const API_BASE = "http://localhost/RSB/api";

  // Static data for exercise (will be replaced with real data if needed)
  const weekExerciseData = [0, 30, 15, 45, 20, 10, 60];
  const monthExerciseData = [
    20, 30, 0, 45, 15, 30, 60, 25, 40, 10,
    50, 35, 20, 55, 30, 0, 45, 60, 20, 35,
    40, 25, 50, 15, 30, 20, 55, 45, 30, 25,
  ];

  const [view, setView] = useState("week");
  const [weekWaterData, setWeekWaterData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [monthWaterData, setMonthWaterData] = useState(new Array(30).fill(0));
  const [loading, setLoading] = useState(true);

  // Generate labels dynamically
  const today = new Date();
  const weekLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  });

  const monthLabels = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  });

  const isWeek = view === "week";
  const waterData = isWeek ? weekWaterData : monthWaterData;
  const exerciseData = isWeek ? weekExerciseData : monthExerciseData;
  const labels = isWeek ? weekLabels : monthLabels;

  // Fetch real water intake data from database
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchWaterData();
  }, [token, view]);

  const fetchWaterData = async () => {
    try {
      setLoading(true);
      const days = isWeek ? 7 : 30;
      const waterByDate = {};

      // Fetch data for each day
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - i));
        const dateStr = date.toISOString().split('T')[0];

        const response = await fetch(`${API_BASE}/water_intake.php?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.success) {
          // Calculate total water in liters for that day
          const totalMl = (result.data || []).reduce((sum, log) => sum + parseInt(log.amount), 0);
          waterByDate[i] = totalMl / 1000; // Convert ml to liters
        } else {
          waterByDate[i] = 0;
        }
      }

      // Update state based on view
      const dataArray = Array.from({ length: days }, (_, i) => waterByDate[i] || 0);
      if (isWeek) {
        setWeekWaterData(dataArray);
      } else {
        setMonthWaterData(dataArray);
      }
    } catch (error) {
      console.error("Failed to fetch water data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalWater = waterData.reduce((a, b) => a + b, 0).toFixed(2);
  const totalExercise = exerciseData.reduce((a, b) => a + b, 0);
  const periodLabel = isWeek ? "This Week" : "This Month";

  const chartData = {
    labels,
    datasets: [
      {
        data: waterData,
        borderColor: "#238b45",
        backgroundColor: "rgba(35,139,69,0.15)",
        borderWidth: 3,
        pointBackgroundColor: "#238b45",
        pointBorderColor: "#fff",
        pointBorderWidth: isWeek ? 3 : 2,
        pointRadius: isWeek ? 6 : 3,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "#e8f5e9" },
        ticks: { color: "#4a7c59", maxTicksLimit: isWeek ? 7 : 10 },
      },
      y: {
        min: 0,
        grid: { color: "#e8f5e9" },
        ticks: { color: "#4a7c59" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-100 via-green-50 to-lime-50 font-sans">
      <div className="p-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-green-700"> Dashboard</h1>
            <p className="text-sm text-green-600 mt-1">Track your eco-friendly lifestyle</p>
          </div>
          <div className="flex gap-1 bg-white border border-green-200 rounded-xl p-1">
            {["Week", "Month"].map((t) => (
              <button
                key={t}
                onClick={() => setView(t.toLowerCase())}
                className={`rounded-lg px-4 py-1.5 text-sm font-bold cursor-pointer transition-all duration-200 ${view === t.toLowerCase()
                    ? "bg-linear-to-br from-green-700 to-green-500 text-white shadow-md"
                    : "bg-transparent text-green-700 hover:bg-green-50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap gap-4 mb-8">

          {/* Water Card */}
          <div className="flex-1 min-w-62.5 bg-linear-to-br from-white to-green-50 border border-green-200 rounded-2xl p-5 min-h-40  hover-scale ">
            <div className="flex justify-between">
              <span className="font-bold text-lg text-green-700">Water Intake</span>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                💧
              </div>
            </div>
            <div className="font-extrabold text-4xl text-green-900 mt-3">{totalWater}L</div>
            <p className="text-green-400 text-sm">Total {periodLabel}</p>
          </div>

          {/* Exercise Card */}
          <div className="flex-1 min-w-62.5 bg-linear-to-br from-white to-green-50 border border-green-200 rounded-2xl p-5 min-h-40  hover-scale ">
            <div className="flex justify-between">
              <span className="font-bold text-lg text-green-700">Exercise</span>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                🏃
              </div>
            </div>
            <div className="font-extrabold text-4xl text-green-900 mt-3">{totalExercise} min</div>
            <p className="text-green-400 text-sm">Total {periodLabel}</p>
          </div>

          {/* Daily Tip Card */}
          <div className="flex-1 min-w-62.5 bg-linear-to-br from-green-700 to-green-500 rounded-2xl p-5 min-h-40 text-white hover-scale ">
            <div className="flex justify-between">
              <span className="font-bold text-lg">Daily Tip</span>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-3xl">
                💡
              </div>
            </div>
            <div className="font-semibold text-[17px] leading-snug mt-3">
              "Drink 8 glasses of water daily for a healthier you!"
            </div>
            <p className="text-white/70 text-sm mt-1">Wellness Quote</p>
          </div>
        </div>

        {/* Medicine Alerts */}
        <div className="bg-white border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg">
              💊
            </div>
            <h2 className="font-bold text-xl text-green-700">Medicine Expiry Alerts</h2>
          </div>
          <div className="flex flex-col items-center py-10 text-green-300">
            <div className="text-6xl mb-3">📋</div>
            <div className="font-semibold text-lg">No Medicine Expiring Soon</div>
            <p className="text-green-200 text-sm mt-1.5">All your medicines are up to date</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-green-200 rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg">
                💧
              </div>
              <h2 className="font-bold text-xl text-green-700">Water Intake (Liters)</h2>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              {periodLabel}
            </span>
          </div>
          <div className="h-65">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}
