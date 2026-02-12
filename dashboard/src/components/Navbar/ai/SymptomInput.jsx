// src/components/ai/SymptomInput.jsx
import { useState } from "react";
import { analyzeSymptoms } from "../../services/aiService";

export default function SymptomInput({ setResult, setEmergency }) {
  const [symptoms, setSymptoms] = useState("");

  const handleAnalyze = () => {
    if (!symptoms) return;
    const { emergency, result } = analyzeSymptoms(symptoms);
    setResult(result);
    setEmergency(emergency);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-md">
      <textarea
        className="w-full p-3 border rounded-md"
        rows="4"
        placeholder="Enter symptoms (e.g. cough, fever, chest pain...)"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Analyze
      </button>
    </div>
  );
}
