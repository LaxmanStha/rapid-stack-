// src/services/aiService.js

export function analyzeSymptoms(symptoms) {
  symptoms = symptoms.toLowerCase();

  const diseases = [
    {
      name: "Heart / Respiratory Issue",
      emergency: "High",
      action: "Call Ambulance Immediately",
      keywords: [
        "chest",
        "breathing",
        "heart",
        "unconscious",
        "severe",
        "pain in chest",
      ],
    },
    {
      name: "Viral Infection / Common Illness",
      emergency: "Medium",
      action: "Visit Doctor Soon",
      keywords: [
        "fever",
        "cough",
        "headache",
        "vomit",
        "nausea",
        "sore throat",
      ],
    },
    {
      name: "Food Poisoning",
      emergency: "Medium",
      action: "Drink fluids, Visit Doctor",
      keywords: ["diarrhea", "vomiting", "stomach pain", "nausea"],
    },
    {
      name: "Flu / Cold",
      emergency: "Low",
      action: "Rest and Home Care",
      keywords: ["runny nose", "sneezing", "mild fever", "cough", "chills"],
    },
    {
      name: "Migraine",
      emergency: "Low",
      action: "Rest, Pain reliever",
      keywords: [
        "headache",
        "sensitivity to light",
        "nausea",
        "throbbing pain",
      ],
    },
    // add more diseases here as needed
  ];

  let matchedDisease = null;

  for (let disease of diseases) {
    if (disease.keywords.some((keyword) => symptoms.includes(keyword))) {
      matchedDisease = disease;
      break; // first match wins
    }
  }

  if (!matchedDisease) {
    return {
      emergency: "Low",
      result: `Emergency Level: Low
Possible Issue: Minor / Unknown
Recommended Action: Home care

Note: Consult a doctor for confirmation.`,
    };
  }

  return {
    emergency: matchedDisease.emergency,
    result: `Emergency Level: ${matchedDisease.emergency}
Possible Issue: ${matchedDisease.name}
Recommended Action: ${matchedDisease.action}

Note: AI-assisted symptom analysis. Always consult a doctor.`,
  };
}
