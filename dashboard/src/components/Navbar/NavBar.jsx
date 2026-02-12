import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Droplets, Dumbbell, Lightbulb, Menu, X } from "lucide-react";
import { MdQrCodeScanner } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-2 py-2 text-gray-900 transition duration-300 ${
      isActive ? "font-semibold" : ""
    }`;

  const mobileLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 text-gray-900 transition duration-300 rounded-lg ${
      isActive ? "font-semibold bg-green-50" : "hover:bg-gray-50"
    }`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogoutClick = () => {
    console.log('handleLogoutClick called');
    setShowLogoutConfirm(true);
    closeMenu();
  };

  const confirmLogout = async () => {
    console.log('confirmLogout called');
    setShowLogoutConfirm(false);
    await logout();
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 py-2.5 shadow-sm relative z-40">
        <div className="flex items-center justify-between max-w-7xl px-4 mx-auto">
          {/* Left Side - Logo */}
          <NavLink to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img
              src="src/assets/logo1.png"
              alt="Logo"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <h2 className="text-yellow-100 text-xl font-semibold tracking-tight flex flex-col">
              <span className="text-green-500 text-lg sm:text-2xl">Eco-Vital</span>
              <span className="text-green-400 text-sm sm:text-base">HealthCare</span>
            </h2>
          </NavLink>

          {/* Center - NavLinks (Desktop Only) */}
          <ul className="hidden lg:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
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

          {/* Right Side - User + Logout (Desktop) & Hamburger (Mobile) */}
          <div className="flex items-center gap-3">
            {/* User Info & Logout - Desktop Only */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-gray-900 font-medium">
                {user ? `Hi, ${user.name}` : "Not logged in"}
              </span>
              {user && (
                <button
                  className="text-white font-medium rounded-lg text-sm px-4 py-2 transition hover:opacity-90"
                  style={{ backgroundColor: "#238b45" }}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              )}
            </div>

            {/* Hamburger Button - Mobile & Tablet Only */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 border-t border-gray-100 mt-2">
            {/* Mobile Nav Links */}
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={mobileLinkStyle}
                  style={({ isActive }) => ({
                    color: isActive ? "#238b45" : undefined,
                  })}
                  onClick={closeMenu}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/water"
                  className={mobileLinkStyle}
                  style={({ isActive }) => ({
                    color: isActive ? "#238b45" : undefined,
                  })}
                  onClick={closeMenu}
                >
                  <Droplets size={20} />
                  WaterIntake
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/exercise"
                  className={mobileLinkStyle}
                  style={({ isActive }) => ({
                    color: isActive ? "#238b45" : undefined,
                  })}
                  onClick={closeMenu}
                >
                  <Dumbbell size={20} />
                  Exercise
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tips"
                  className={mobileLinkStyle}
                  style={({ isActive }) => ({
                    color: isActive ? "#238b45" : undefined,
                  })}
                  onClick={closeMenu}
                >
                  <Lightbulb size={20} />
                  Tips
                </NavLink>
              </li>
            </ul>

            {/* Mobile User Info & Logout */}
            <div className="md:hidden flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-gray-900 font-medium text-sm">
                {user ? `Hi, ${user.name}` : "Not logged in"}
              </span>
              {user && (
                <button
                  className="text-white font-medium rounded-lg text-sm px-4 py-2 transition hover:opacity-90"
                  style={{ backgroundColor: "#238b45" }}
                  onClick={handleLogoutClick}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Floating QR Scanner Button */}
      <button
        onClick={() => {
          navigate("/scanner");
          closeMenu();
        }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 
                   hover:bg-indigo-700 text-white rounded-full shadow-lg 
                   hover:scale-110 active:scale-95 transition-all duration-200
                   flex items-center justify-center group"
      >
        <MdQrCodeScanner className="text-xl sm:text-2xl group-hover:rotate-12 transition-transform" />

        {/* Tooltip - Hidden on mobile */}
        <span
          className="absolute right-16 bg-gray-900 text-white text-xs 
                      px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                      transition-opacity whitespace-nowrap hidden sm:block"
        >
          Scan QR / Barcode
        </span>

        {/* Pulse ring */}
        <span
          className="absolute w-full h-full rounded-full border-2 
                      border-indigo-400 animate-ping opacity-30"
        />
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowLogoutConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                onClick={confirmLogout}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
