import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ServiceAdded.css";

function ServiceAdded() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const service = location.state;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!service) {
    return (
      <div className="sa-page">
        <div className="sa-not-found">
          <div className="sa-not-found-icon">◈</div>
          <h3>No Service Data Found</h3>
          <button className="sa-btn" onClick={() => navigate("/MyServices")}>
            Go to My Services
          </button>
        </div>
      </div>
    );
  }

  const days = service.workingDays
    ? service.workingDays.split(",").map(d => d.trim()).filter(Boolean)
    : [];

  const details = [
    { label: "Location",      value: service.location,    icon: "📍" },
    { label: "Working Hours", value: `${service.workingStart} — ${service.workingEnd}`, icon: "⏰" },
    { label: "Service Charge",value: `₹ ${service.serviceCharge} / visit`, icon: "💰" },
  ];

  return (
    <div className="sa-page">
      <div className="sa-orb sa-orb1" />
      <div className="sa-orb sa-orb2" />

      <div className={`sa-card ${visible ? "sa-visible" : ""}`}>

        <div className="sa-check-wrap">
          <svg viewBox="0 0 52 52" className="sa-check-svg">
            <circle className="sa-check-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="sa-check-path" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <p className="sa-eyebrow">Service Portal</p>
        <h1 className="sa-title">Service <em>Added!</em></h1>
        <p className="sa-subtitle">
          Your service has been listed successfully and is pending admin verification.
        </p>

        {service.description && (
          <div className="sa-desc-box">
            <p className="sa-desc-label">Description</p>
            <p className="sa-desc-text">"{service.description}"</p>
          </div>
        )}

        <div className="sa-details">
          {details.map((d, i) => (
            <div key={i} className="sa-detail-row">
              <div className="sa-detail-left">
                <span className="sa-detail-icon">{d.icon}</span>
                <span className="sa-detail-label">{d.label}</span>
              </div>
              <span className="sa-detail-value">{d.value || "—"}</span>
            </div>
          ))}
        </div>

        {days.length > 0 && (
          <div className="sa-days-wrap">
            <p className="sa-days-label">Working Days</p>
            <div className="sa-days-row">
              {days.map((day, i) => (
                <span key={i} className="sa-day-pill">{day.slice(0, 3)}</span>
              ))}
            </div>
          </div>
        )}

        <div className="sa-btn-row">
          <button className="sa-btn-outline" onClick={() => navigate("/AddService")}>
            + Add Another
          </button>
          <button className="sa-btn" onClick={() => navigate("/MyServices")}>
            View My Services →
          </button>
        </div>

      </div>
    </div>
  );
}

export default ServiceAdded;
