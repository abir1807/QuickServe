import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthModal from "../components/AuthModal";
import UserNavbar from "../components/UserNavbar";
import "./ServiceProviders.css";

function ServiceProviders() {
  const { serviceId } = useParams();
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [pendingProviderId, setPendingProviderId] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8086/provider/providers/${serviceId}`)
      .then((res) => setProviders(res.data))
      .catch((err) => console.log(err));
  }, [serviceId]);

  const handleBooking = (providerId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPendingProviderId(providerId);
      setShowAuth(true);
    } else {
      navigate(`/booking/${providerId}`);
    }
  };

  return (
    <div className="sp-page" style={{ paddingTop: "64px" }}>
      <UserNavbar />

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="sp-back-btn">
        ← Back to Services
      </button>

      {/* Editorial Header */}
      <header className="sp-header">
        <div className="sp-header-rule">
          <span className="sp-pre-title">Verified Professionals</span>
        </div>
        <div className="sp-title-block">
          <h2 className="sp-title">
            Expert <em>Providers</em><br />Near You
          </h2>
          <p className="sp-subtitle">
            Hand-picked professionals,<br />
            vetted for quality and<br />
            ready to serve you.
          </p>
        </div>
      </header>

      {/* Provider Cards */}
      {providers.length === 0 ? (
        <div className="sp-empty">
          <div className="sp-empty-icon">◈</div>
          <h3>No providers yet</h3>
          <p>New professionals are joining daily — check back soon.</p>
        </div>
      ) : (
        providers.map((p, index) => (
          <div
            key={p.id}
            className="sp-card"
            style={{ "--delay": `${index * 0.09}s` }}
          >
            {/* Images */}
            <div className="sp-image-section">
              {p.image1 && (
                <img
                  src={`/assets/services/${p.image1}`}
                  className="sp-provider-img"
                  alt="service-1"
                />
              )}
              {p.image2 && (
                <img
                  src={`/assets/services/${p.image2}`}
                  className="sp-provider-img"
                  alt="service-2"
                />
              )}
            </div>

            {/* Info */}
            <div className="sp-info-section">
              <div>
                <div className="sp-card-index">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="sp-provider-email">
                  {p.providerEmail}
                </h3>
                <span className="sp-name-line" />

                <p className="sp-description">{p.description}</p>

                <div className="sp-details-grid">
                  <div className="sp-detail-item">📍 <b>Location</b> {p.location}</div>
                  <div className="sp-detail-item">📅 <b>Days</b> {p.workingDays}</div>
                  <div className="sp-detail-item">⏰ <b>Hours</b> {p.workingStart} – {p.workingEnd}</div>
                </div>
              </div>

              <div className="sp-card-footer">
                <div>
                  <div className="sp-price-label">Service Charge</div>
                  <div className="sp-price">
                    ₹{p.serviceCharge}
                    <span className="sp-price-unit">/ visit</span>
                  </div>
                </div>

                <button
                  className="sp-book-btn"
                  onClick={() => handleBooking(p.id)}
                >
                  <span>Confirm Booking</span>
                  <span className="sp-btn-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={showAuth}
        closeModal={() => setShowAuth(false)}
        onLoginSuccess={() => {
          setShowAuth(false);
          if (pendingProviderId) {
            navigate(`/booking/${pendingProviderId}`);
          }
        }}
      />

    </div>
  );
}

export default ServiceProviders;
