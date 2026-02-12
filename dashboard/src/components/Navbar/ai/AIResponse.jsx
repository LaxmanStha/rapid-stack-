import React from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AIResponse({ result, emergency }) {
  const navigate = useNavigate();

  if (!result) return null;

  const getColor = () => {
    if (emergency === "High") return "bg-red-200 border-red-500";
    if (emergency === "Medium") return "bg-yellow-200 border-yellow-500";
    return "bg-green-200 border-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-6 p-6 border-l-4 rounded-xl w-full max-w-md shadow-lg ${getColor()}`}
    >
      <motion.h2
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold mb-3 flex items-center gap-2"
      >
        🩺 AI Result
      </motion.h2>

      <motion.pre
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="whitespace-pre-wrap bg-white p-4 rounded-md shadow-inner"
      >
        {result}
      </motion.pre>

      {emergency === "High" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/ambulance-booking")}
          className="mt-4 w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-200"
        >
          🚑 Book Ambulance
        </motion.button>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-sm text-gray-500 italic"
      >
        ⚠️ This is AI-assisted only. For real emergency, contact a doctor.
      </motion.p>
    </motion.div>
  );
}
