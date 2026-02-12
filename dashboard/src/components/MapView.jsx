import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import ambulanceImg from "../assets/ambulance.png";

const ambulanceIcon = new L.Icon({
  iconUrl: ambulanceImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Linear interpolation helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function MapView({ pickup, hospital }) {
  const markerRef = useRef(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [ambulancePos, setAmbulancePos] = useState(pickup);

  // Fetch route from OSRM
  useEffect(() => {
    async function fetchRoute() {
      if (!pickup || !hospital) return;
      const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${hospital.lng},${hospital.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lng, lat]) => ({
            lat,
            lng,
          }),
        );
        setRouteCoords(coords);
      }
    }
    fetchRoute();
  }, [pickup, hospital]);

  // Animate smoothly along route
  useEffect(() => {
    if (routeCoords.length < 2) return;

    let segment = 0;
    let progress = 0;
    const duration = 120000; // 2 minutes total
    const segmentDuration = duration / (routeCoords.length - 1);
    let lastTime = null;

    function animate(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      progress += delta / segmentDuration;
      if (progress >= 1) {
        progress = 0;
        segment++;
        if (segment >= routeCoords.length - 1) return; // finished
      }

      const start = routeCoords[segment];
      const end = routeCoords[segment + 1];
      const lat = lerp(start.lat, end.lat, progress);
      const lng = lerp(start.lng, end.lng, progress);
      const newPos = { lat, lng };

      setAmbulancePos(newPos);
      if (markerRef.current) {
        markerRef.current.setLatLng(newPos);
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [routeCoords]);

  return (
    <MapContainer
      center={pickup}
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="red" />
      )}

      <Marker position={pickup} />
      <Marker position={hospital} />
      <Marker ref={markerRef} position={ambulancePos} icon={ambulanceIcon} />
    </MapContainer>
  );
}