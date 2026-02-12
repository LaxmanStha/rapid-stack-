import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar/NavBar";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import WaterIntake from "./pages/WaterIntake";
import Exercise from "./pages/Exercise";
import Tips from "./pages/Tips";
import AmbulanceForm from "./components/AmbulanceForm";

import Tracking from "./pages/Tracking";
import SymptomChecker from "./pages/SymptomChecker";
import ScannerPage from "./pages/QrScanner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/water" element={<WaterIntake />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/ambulance-booking" element={<AmbulanceForm />} />
          <Route path="/scanner" element={<ScannerPage/>} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;