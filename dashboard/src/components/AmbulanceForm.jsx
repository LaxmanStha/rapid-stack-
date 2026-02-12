
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AmbulanceForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [pickup, setPickup] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [hospital, setHospital] = useState("");
  const [hospitalSuggestions, setHospitalSuggestions] = useState([]);
  const [hospitalCoords, setHospitalCoords] = useState(null);
  const [email, setEmail] = useState("");

  // Generic location search
  const searchLocation = async (value, setSuggestions) => {
    if (value.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value}, Nepal&format=json`,
      );
      const data = await res.json();
      if (Array.isArray(data)) setSuggestions(data.slice(0, 5));
    } catch (err) {
      console.log("Location search error", err);
    }
  };

  // Hospital search
  const searchHospital = async (value) => {
    setHospital(value);
    if (value.length < 3) {
      setHospitalSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value} hospital Nepal&format=json&addressdetails=1&limit=15`,
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data
          .filter(
            (place) =>
              place.display_name.toLowerCase().includes("hospital") ||
              place.type === "hospital",
          )
          .slice(0, 10);

        const unique = filtered.filter(
          (v, i, a) =>
            a.findIndex((t) => t.display_name === v.display_name) === i,
        );
        unique.sort((a, b) => a.display_name.localeCompare(b.display_name));
        setHospitalSuggestions(unique);
      }
    } catch (err) {
      console.log("Hospital fetch error", err);
      setHospitalSuggestions([]);
    }
  };

  // Validation helpers
  const isValidName = (value) => /^[a-zA-Z\s]{2,50}$/.test(value);
  const isValidContact = (value) => /^(\+?977)?-?\d{7,10}$/.test(value); // Nepal phone number format

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name ||
      !isValidName(name) ||
      !contact ||
      !isValidContact(contact) ||
      !pickupCoords ||
      !hospitalCoords ||
      !email
    ) {
      alert("Please fill all required fields correctly.");
      return;
    }

    navigate("/tracking", {
      state: {
        name,
        contact,
        pickupCoords,
        hospitalCoords,
        email,
        pickup,
        hospital,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-white flex flex-col items-center justify-start pt-6 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-4 border border-gray-200"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-red-700 text-center mb-3 drop-shadow-md">
          🚑 Book an Ambulance
        </h2>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          placeholder="Full Name"
          required
        />

        {/* Contact Number */}
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          placeholder="Contact Number"
          required
        />

        {/* Pickup Location */}
        <div className="relative">
          <input
            value={pickup}
            onChange={(e) => {
              setPickup(e.target.value);
              searchLocation(e.target.value, setPickupSuggestions);
            }}
            className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            placeholder="Pickup Location"
            required
          />
          {pickupSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bg-white border w-full max-h-40 overflow-y-auto z-20 rounded-lg shadow-lg mt-1"
            >
              {pickupSuggestions.map((place) => (
                <div
                  key={place.place_id}
                  className="p-2 hover:bg-red-100 cursor-pointer transition"
                  onClick={() => {
                    setPickup(place.display_name);
                    setPickupCoords({
                      lat: parseFloat(place.lat),
                      lng: parseFloat(place.lon),
                    });
                    setPickupSuggestions([]);
                  }}
                >
                  {place.display_name}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Hospital Location */}
        <div className="relative">
          <input
            value={hospital}
            onChange={(e) => searchHospital(e.target.value)}
            className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            placeholder="Destination Hospital"
            required
          />
          {hospitalSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bg-white border w-full max-h-60 overflow-y-auto z-20 rounded-lg shadow-lg mt-1"
            >
              {hospitalSuggestions.map((place) => (
                <div
                  key={place.place_id}
                  className="p-2 hover:bg-red-100 cursor-pointer transition"
                  onClick={() => {
                    setHospital(place.display_name);
                    setHospitalCoords({
                      lat: parseFloat(place.lat),
                      lng: parseFloat(place.lon),
                    });
                    setHospitalSuggestions([]);
                  }}
                >
                  {place.display_name}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          placeholder="Your Email"
          required
        />

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
        >
          Request Ambulance
        </motion.button>
      </motion.form>
    </div>
  );
}
