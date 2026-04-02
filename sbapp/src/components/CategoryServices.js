import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryServices.css";
import UserNavbar from "../components/UserNavbar";

function CategoryServices() {
  const { cid } = useParams();
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8086/services/category/${cid}`)
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, [cid]);

  return (
    <div className="cs-page" style={{ paddingTop: "64px" }}>
      <UserNavbar />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="cs-back-btn"
      >
        <span className="cs-back-arrow">←</span>
        Back to Categories
      </button>

      {/* Header */}
      <header className="cs-header">
        <p className="cs-pre-title">Curated Providers</p>
        <h2 className="cs-title">
          Available <em>Services</em>
        </h2>
        <p className="cs-subtitle">
          Explore our premium selection of curated services tailored for you.
        </p>
      </header>

      {/* Grid */}
      <div className="cs-grid">
        {services.length === 0 ? (
          <div className="cs-empty">
            <h3>No services yet</h3>
            <p>Check back soon — providers are joining daily.</p>
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={service.serviceId}
              className="cs-card"
              style={{ "--delay": `${index * 0.06}s` }}
            >
              <span className="cs-card-num">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="cs-service-name">{service.serviceName}</h3>

              <Link
                to={`/service/${service.serviceId}`}
                className="cs-view-link"
              >
                View Providers
                <span className="cs-view-arrow">→</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryServices;
