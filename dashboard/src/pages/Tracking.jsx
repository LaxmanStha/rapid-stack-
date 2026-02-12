import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapView from "../components/MapView";
import emailjs from "@emailjs/browser";

export default function Tracking() {
  const location = useLocation();
  const { pickupCoords, hospitalCoords, email, pickup, hospital } =
    location.state || {};
  const [ambulancePos, setAmbulancePos] = useState(pickupCoords);
  const [path, setPath] = useState([]);

  if (!pickupCoords || !hospitalCoords) {
    return <div className="text-center mt-10">Invalid Route</div>;
  }

  useEffect(() => {
    if (!pickupCoords || !hospitalCoords) return;

    // Path: pickup → midpoint → hospital
    const points = [
      pickupCoords,
      {
        lat: (pickupCoords.lat + hospitalCoords.lat) / 2,
        lng: (pickupCoords.lng + hospitalCoords.lng) / 2,
      },
      hospitalCoords,
    ];
    setPath(points);

    let i = 0;
    const interval = setInterval(() => {
      setAmbulancePos(points[i]);
      i++;
      if (i >= points.length) {
        clearInterval(interval);
        // Send arrival email
        sendArrivalEmail();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [pickupCoords, hospitalCoords]);

  const sendArrivalEmail = () => {
    if (!email) return;

    emailjs
      .send(
        "service_aa5vw3o",
        "template_dfdiek9",
        {
          email: email,
          pickup_location: pickup,
          hospital_location: hospital,
          message: `🚑 Your ambulance has arrived at ${hospital}!`,
        },
        "0UBhPxHj-IF-ZBUVJ",
      )
      .then(() => console.log("Arrival email sent"))
      .catch((err) => console.log("Email send error:", err));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Live Ambulance Tracking
      </h1>

      {/* MapView receives ambulancePos to update marker */}
      <MapView
        pickup={pickupCoords}
        hospital={hospitalCoords}
        ambulancePos={ambulancePos}
      />
    </div>
  );
}
