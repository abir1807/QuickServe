import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import axios from "axios";

import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:
    require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:
    require("leaflet/dist/images/marker-shadow.png"),
});

// Move map when center changes
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Click on map to select location
function LocationMarker({ setPosition }) {

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });

  return null;
}

function AddMap() {

  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [mapCenter, setMapCenter] = useState([23.6850, 87.8550]);

  // 🔎 Search Location
  const handleSearch = async () => {

    if (!search.trim()) return;

    try {

      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: search,
            format: "json",
            limit: 1
          }
        }
      );

      if (res.data.length > 0) {

        const lat = parseFloat(res.data[0].lat);
        const lon = parseFloat(res.data[0].lon);

        setMapCenter([lat, lon]);
        setPosition({ lat, lng: lon });

      } else {
        alert("Location not found. Try simpler name like 'Raniganj'");
      }

    } catch (err) {
      console.log(err);
      alert("Search failed");
    }

  };

  // 📍 Auto-detect Current Location
  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setMapCenter([lat, lng]);
        setPosition({ lat, lng });

      },
      () => {
        alert("Location permission denied");
      }
    );

  };

  // 💾 Save Location
  const handleSave = () => {

    if (!position) {
      alert("Select location first");
      return;
    }

    localStorage.setItem(
      "selectedLocation",
      JSON.stringify(position)
    );

    navigate("/AddService");
  };

  return (

    <div style={{ padding: "20px" }}>

      <h3>Select Location</h3>

      {/* 🔎 Search */}
      <div className="input-group mb-3">

        <input
          type="text"
          className="form-control"
          placeholder="Search location (e.g. Asansol)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>

      </div>

      {/* 📍 Current Location Button */}
      <button
        className="btn btn-warning mb-3"
        onClick={handleCurrentLocation}
      >
        📍 Use My Current Location
      </button>

      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: "400px", width: "100%" }}
      >

        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeMapView center={mapCenter} />

        <LocationMarker setPosition={setPosition} />

        {position && (
          <Marker position={position} />
        )}

      </MapContainer>

      <button
        className="btn btn-success mt-3"
        onClick={handleSave}
      >
        Save Location
      </button>

    </div>
  );
}

export default AddMap;