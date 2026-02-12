import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar/NavBar";

import Dashboard from "./pages/Dashboard";
import WaterIntake from "./pages/WaterIntake";
import Exercise from "./pages/Exercise";
import Tips from "./pages/Tips";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/water" element={<WaterIntake />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
