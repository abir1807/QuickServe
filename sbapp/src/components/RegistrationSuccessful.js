import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegistrationSuccessful.css";

function RegistrationSuccessful() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const { email, password } = location.state || { email: "Not Available", password: "" };

  const maskedPassword = password
    ? password[0] + "*".repeat(Math.max(0, password.length - 2)) + password.slice(-1)
    : "****";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="rs-page">
      <div className="rs-orb rs-orb1" />
      <div className="rs-orb rs-orb2" />
      <div className="rs-orb rs-orb3" />

      <div className={`rs-card ${visible ? "rs-card-visible" : ""}`}>

        <div className="rs-check-wrap">
          <svg viewBox="0 0 52 52" className="rs-check-svg">
            <circle className="rs-check-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="rs-check-path" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <p className="rs-eyebrow">Registration Complete</p>

        <h1 className="rs-title">Welcome to<br /><em>QuickServe</em></h1>

        <p className="rs-subtitle">
          Your provider account has been created successfully.
        </p>

        <div className="rs-info-box">
          <div className="rs-info-row">
            <span className="rs-info-label">Email ID</span>
            <span className="rs-info-value">{email}</span>
          </div>
          <div className="rs-info-divider" />
          <div className="rs-info-row">
            <span className="rs-info-label">Password</span>
            <span className="rs-info-value rs-mono">{maskedPassword}</span>
          </div>
        </div>

        <div className="rs-notice">
          <span className="rs-notice-icon">✦</span>
          <p>
            A confirmation email with your unique <strong>Provider ID</strong> has been sent to your inbox.
          </p>
        </div>

        <button
          className="rs-btn"
          onClick={() => navigate("/PrroviderLogin")}
        >
          Access Your Dashboard
          <span className="rs-btn-arrow">→</span>
        </button>

        <p className="rs-footer-note">
          Admin verification may be required before your services go live.
        </p>

      </div>
    </div>
  );
}

export default RegistrationSuccessful;
