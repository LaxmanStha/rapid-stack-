// src/pages/SymptomChecker.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import SymptomInput from "../components/ai/SymptomInput";
import AIResponse from "../components/ai/AIResponse";

export default function SymptomChecker() {
  const [result, setResult] = useState("");
  const [emergency, setEmergency] = useState("Low");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white flex flex-col items-center py-8 px-4">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-red-700 mb-6 text-center"
      >
        🏥 RapidCare AI Symptom Checker
      </motion.h1>

      {/* Input Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <SymptomInput setResult={setResult} setEmergency={setEmergency} />
      </motion.div>

      {/* AI Result Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full max-w-md mt-6 p-6 rounded-xl shadow-lg border border-gray-200"
        >
          <AIResponse result={result} emergency={emergency} />
        </motion.div>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-8 text-gray-500 text-xs md:text-sm text-center max-w-sm"
      ></motion.p>
    </div>
  );
}
