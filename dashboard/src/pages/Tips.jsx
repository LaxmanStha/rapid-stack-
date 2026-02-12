import React from "react";
import { useState } from "react";

export default function TipsDashboard() {
  const [tips, setTips] = useState([
    {
      title: "Switch to Energy-Efficient Appliances",
      impact: "High",
      desc: "Upgrade to ENERGY STAR appliances to save energy and reduce carbon footprint.",
      emoji: "⚡",
    },
    {
      title: "Establish a Hydration Routine",
      impact: "Medium",
      desc: "Track your water intake and aim for 2 liters daily.",
      emoji: "💧",
    },
    {
      title: "Incorporate Short Exercise Sessions",
      impact: "Medium",
      desc: "Start with 5-10 minutes of activity daily and build consistency.",
      emoji: "🏃",
    },
    {
      title: "Adopt a Plant-Based Meal Plan",
      impact: "High",
      desc: "Include more plant-based meals to improve health and reduce emissions.",
      emoji: "🥗",
    },
    {
      title: "Practice Mindfulness",
      impact: "Medium",
      desc: "Spend 5-10 minutes daily on deep breathing or meditation.",
      emoji: "🧘",
    },
  ]);

  const quickTips = [
    {
      title: "Reduce Energy",
      desc: "Use LED bulbs, unplug devices, and rely on natural light.",
      emoji: "💡",
    },
    {
      title: "Stay Hydrated",
      desc: "Keep a reusable water bottle with you.",
      emoji: "💧",
    },
    {
      title: "Move Daily",
      desc: "Aim for 30 minutes of exercise daily.",
      emoji: "🔥",
    },
  ];

  const refreshTips = () => {
    setTips([...tips].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#f0fdf4" }}>
      <h1
        className="text-3xl font-bold mb-2 flex items-center gap-2"
        style={{ color: "#238b45" }}
      >
        🌿 AI-Personalized Tips
      </h1>
      <p className="text-gray-600 mb-6">
        Sustainability and wellness tips tailored just for you
      </p>

      {/* Personalized Tips */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-lg transform transition hover:scale-105 hover:shadow-xl"
          >
            <h2
              className="text-lg font-semibold flex items-center gap-2"
              style={{ color: "#238b45" }}
            >
              {tip.emoji} {tip.title}
            </h2>
            <p className="text-gray-600 mt-2">{tip.desc}</p>
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium animate-pulse ${
                tip.impact === "High"
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {tip.impact} Impact
            </span>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <h2
        className="text-2xl font-bold mb-3 flex items-center gap-2"
        style={{ color: "#238b45" }}
      >
        ⚡ Quick Sustainability Tips
      </h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {quickTips.map((qt, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <h3
              className="font-semibold flex items-center gap-2"
              style={{ color: "#238b45" }}
            >
              {qt.emoji} {qt.title}
            </h3>
            <p className="text-gray-600 mt-1">{qt.desc}</p>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <button
        onClick={refreshTips}
        className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition transform hover:scale-105"
        style={{ backgroundColor: "#238b45" }}
      >
        🔄 Refresh Tips
      </button>
    </div>
  );
}
