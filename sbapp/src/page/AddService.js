import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddService.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:       require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:     require("leaflet/dist/images/marker-shadow.png"),
});

function LocationMarker({ setPosition }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const addr = data.address;
        const readable =
          addr.road     ? `${addr.road}, ${addr.city || addr.town || addr.village || ""}, ${addr.state || ""}` :
          addr.suburb   ? `${addr.suburb}, ${addr.city || addr.town || ""}, ${addr.state || ""}` :
          addr.city     ? `${addr.city}, ${addr.state || ""}` :
          addr.town     ? `${addr.town}, ${addr.state || ""}` :
          addr.village  ? `${addr.village}, ${addr.state || ""}` :
          data.display_name ? data.display_name.split(",").slice(0,3).join(",") :
          `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setPosition({ latlng: e.latlng, readable: readable.trim() });
      } catch {
        setPosition({ latlng: e.latlng, readable: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
      }
    }
  });
  return null;
}

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function AddService() {
  const navigate     = useNavigate();
  const provider     = JSON.parse(localStorage.getItem("provider"));
  const providerEmail = provider?.email;

  const [categories, setCategories] = useState([]);
  const [services,   setServices]   = useState([]);
  const [images,     setImages]     = useState([]);
  const [showMap,    setShowMap]    = useState(false);
  const [mapPosition,setMapPosition]= useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    cid: "", serviceId: "", description: "",
    location: "", workingStart: "", workingEnd: "",
    workingDays: "", serviceCharge: ""
  });

  useEffect(() => {
    axios.get("http://localhost:8086/api/fetch")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleCategoryChange = async (cid) => {
    setForm(prev => ({ ...prev, cid, serviceId: "" }));
    setServices([]);
    try {
      const res = await axios.get(`http://localhost:8086/services/category/${cid}`);
      setServices(res.data);
    } catch (err) { console.log(err); }
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const updated = [...images, ...files];
    if (updated.length > 2) { alert("Maximum 2 images allowed"); return; }
    setImages(updated);
  };

  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx));

  const toggleDay = (day, checked) => {
    let updated = checked
      ? (form.workingDays ? form.workingDays + "," + day : day)
      : (form.workingDays || "").split(",").filter(d => d !== day).join(",");
    handleChange("workingDays", updated);
  };

  const handleSubmit = async () => {
    if (!form.serviceId)    return alert("Please select a service");
    if (!form.location)     return alert("Please select a location on map");
    if (!form.workingDays)  return alert("Please select working days");
    if (images.length < 1)  return alert("Please upload at least 1 image");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("providerEmail", providerEmail);
      formData.append("serviceId",    parseInt(form.serviceId));
      formData.append("description",  form.description);
      formData.append("location",     form.location);
      formData.append("workingStart", form.workingStart);
      formData.append("workingEnd",   form.workingEnd);
      formData.append("workingDays",  form.workingDays);
      formData.append("serviceCharge",form.serviceCharge);
      images.forEach(img => formData.append("images", img));

      await axios.post("http://localhost:8086/provider/addService", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/serviceadded", { state: form });
    } catch (err) {
      console.log(err.response?.data);
      alert("Error adding service");
      setSubmitting(false);
    }
  };

  const selectedDays = form.workingDays ? form.workingDays.split(",") : [];

  return (
    <div className="as-layout">
      <Sidebar />

      <div className="as-main">

        <div className="as-topbar">
          <p className="as-eyebrow">Provider Portal</p>
          <h2 className="as-title">Add <em>Service</em></h2>
        </div>

        <div className="as-body">

          <div className="as-left">

            <div className="as-section">
              <p className="as-section-label">01 — Service Type</p>

              <div className="as-field">
                <label className="as-label">Category</label>
                <select
                  className="as-select"
                  value={form.cid}
                  onChange={e => handleCategoryChange(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.cid} value={cat.cid}>{cat.cname}</option>
                  ))}
                </select>
              </div>

              <div className="as-field">
                <label className="as-label">Service</label>
                <select
                  className="as-select"
                  value={form.serviceId}
                  onChange={e => handleChange("serviceId", e.target.value)}
                  disabled={!form.cid}
                >
                  <option value="">
                    {form.cid ? "Select a service" : "Select category first"}
                  </option>
                  {services.map(s => (
                    <option key={s.serviceId} value={s.serviceId}>{s.serviceName}</option>
                  ))}
                </select>
              </div>

              <div className="as-field">
                <label className="as-label">Description</label>
                <textarea
                  className="as-textarea"
                  placeholder="Describe your service in detail…"
                  rows={3}
                  onChange={e => handleChange("description", e.target.value)}
                />
              </div>
            </div>

            <div className="as-section">
              <p className="as-section-label">02 — Location</p>

              <div className="as-field">
                <label className="as-label">Service Location</label>
                <div className="as-location-row">
                  <input
                    className="as-input as-location-input"
                    placeholder="Click 'Pick on Map' to select"
                    value={form.location}
                    readOnly
                  />
                  <button className="as-map-btn" onClick={() => setShowMap(true)}>
                    📍 Pick on Map
                  </button>
                </div>
              </div>
            </div>

            <div className="as-section">
              <p className="as-section-label">03 — Working Hours</p>

              <div className="as-time-row">
                <div className="as-field">
                  <label className="as-label">Start Time</label>
                  <input
                    type="time"
                    className="as-input"
                    onChange={e => handleChange("workingStart", e.target.value)}
                  />
                </div>
                <div className="as-time-sep">—</div>
                <div className="as-field">
                  <label className="as-label">End Time</label>
                  <input
                    type="time"
                    className="as-input"
                    onChange={e => handleChange("workingEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="as-right">

            <div className="as-section">
              <p className="as-section-label">04 — Working Days</p>
              <div className="as-days-grid">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    className={`as-day-btn ${selectedDays.includes(day) ? "as-day-active" : ""}`}
                    onClick={() => toggleDay(day, !selectedDays.includes(day))}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <p className="as-days-summary">
                  {selectedDays.join(" · ")}
                </p>
              )}
            </div>

            <div className="as-section">
              <p className="as-section-label">05 — Service Images</p>

              <div className="as-images-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="as-img-preview">
                    <img src={URL.createObjectURL(img)} alt="preview" />
                    <button className="as-img-remove" onClick={() => removeImage(idx)}>✕</button>
                  </div>
                ))}

                {images.length < 2 && (
                  <label className="as-img-upload">
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <span className="as-upload-icon">+</span>
                    <span className="as-upload-label">
                      {images.length === 0 ? "Add Photo" : "Add Another"}
                    </span>
                  </label>
                )}
              </div>

              {images.length === 1 && (
                <p className="as-img-hint">You can add one more image</p>
              )}
              {images.length === 2 && (
                <p className="as-img-hint as-img-hint-done">✦ Both images uploaded</p>
              )}
            </div>

            <div className="as-section">
              <p className="as-section-label">06 — Pricing</p>
              <div className="as-field">
                <label className="as-label">Service Charge (₹)</label>
                <input
                  className="as-input as-price-input"
                  placeholder="e.g. 500"
                  type="number"
                  min="0"
                  onChange={e => handleChange("serviceCharge", e.target.value)}
                />
              </div>
            </div>

            <button
              className={`as-submit-btn ${submitting ? "as-submitting" : ""}`}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting
                ? <span className="as-spinner" />
                : <>Add Service <span className="as-arrow">→</span></>
              }
            </button>

          </div>
        </div>
      </div>

      {showMap && (
        <div className="as-map-overlay">
          <div className="as-map-modal">
            <div className="as-map-modal-header">
              <div>
                <p className="as-eyebrow">Location</p>
                <h3 className="as-map-title">Pick Your <em>Location</em></h3>
              </div>
              <button className="as-map-close" onClick={() => setShowMap(false)}>✕</button>
            </div>

            {form.location && (
              <div className="as-map-selected">
                📍 {form.location}
              </div>
            )}

            <MapContainer
              center={[23.6850, 87.8550]}
              zoom={10}
              style={{ height: "380px", borderRadius: "12px" }}
            >
              <TileLayer
                attribution="© OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                setPosition={({ latlng, readable }) => {
                  setMapPosition(latlng);
                  handleChange("location", readable);
                }}
              />
              {mapPosition && <Marker position={mapPosition} />}
            </MapContainer>

            <button className="as-map-save" onClick={() => setShowMap(false)}>
              Save Location →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default AddService;
