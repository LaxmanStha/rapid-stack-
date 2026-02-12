import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar/NavBar";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import WaterIntake from "./pages/WaterIntake";
import Exercise from "./pages/Exercise";
import Tips from "./pages/Tips";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
