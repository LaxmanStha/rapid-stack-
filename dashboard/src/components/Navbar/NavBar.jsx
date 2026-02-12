import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Droplets, Dumbbell, Lightbulb } from "lucide-react";

const NavBar = () => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-2 py-2 text-gray-900 transition duration-300 ${
      isActive ? "font-semibold" : ""
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 py-2.5 shadow-sm">
      <div className="flex items-center justify-between max-w-screen-xl px-4 mx-auto relative">
        {/* Left Side - Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Eco Vital Logo"
            className="h-6 w-6 sm:h-9 sm:w-9 object-contain"
          />
          <span className="text-xl font-semibold text-gray-900">ECO VITAL</span>
        </NavLink>

        {/* Center - NavLinks */}
        <ul className="flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <li>
            <NavLink
              to="/"
              className={linkStyle}
              style={({ isActive }) => ({
                color: isActive ? "#238b45" : undefined,
              })}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/water"
              className={linkStyle}
              style={({ isActive }) => ({
                color: isActive ? "#238b45" : undefined,
              })}
            >
              <Droplets size={18} />
              WaterIntake
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/exercise"
              className={linkStyle}
              style={({ isActive }) => ({
                color: isActive ? "#238b45" : undefined,
              })}
            >
              <Dumbbell size={18} />
              Exercise
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tips"
              className={linkStyle}
              style={({ isActive }) => ({
                color: isActive ? "#238b45" : undefined,
              })}
            >
              <Lightbulb size={18} />
              Tips
            </NavLink>
          </li>
        </ul>

        {/* Right Side - ID + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-900 font-medium">ID: 12345</span>
          <button
            className="text-white font-medium rounded-lg text-sm px-4 py-2 transition"
            style={{ backgroundColor: "#238b45" }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
