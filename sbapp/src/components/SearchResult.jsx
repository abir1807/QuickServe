import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../components/UserNavbar";
import "./SearchResults.css";

function SearchResults() {
  const location = useLocation();
  const navigate  = useNavigate();

  const params = new URLSearchParams(location.search);
  const query  = params.get("q") || "";
  const loc    = params.get("loc") || "";

  const [results,     setResults]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [allServices, setAllServices] = useState([]);

  const filterResults = (services, q) => {
    if (!q) { setResults(services); return; }
    const filtered = services.filter(s =>
      s.serviceName?.toLowerCase().includes(q.toLowerCase()) ||
      s.serviceType?.toLowerCase().includes(q.toLowerCase())
    );
    setResults(filtered);
  };

  useEffect(() => {
    axios.get("http://localhost:8086/fetchs")
      .then(res => {
        setAllServices(res.data);
        filterResults(res.data, query);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [query]);

  useEffect(() => {
    if (allServices.length > 0) filterResults(allServices, query);
  }, [query]);

  return (
    <div className="sr-page" style={{ paddingTop: "64px" }}>
      <UserNavbar />

      <div className="sr-header">
        <button className="sr-back-btn" onClick={() => navigate("/Home")}>
          ← Back to Home
        </button>
        <div className="sr-search-info">
          <h2 className="sr-title">
            Results for <em>"{query}"</em>
          </h2>
          {loc && <p className="sr-location">📍 {loc}</p>}
          {!loading && (
            <p className="sr-count">
              {results.length} service{results.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="sr-loading">
          <div className="sr-spinner" />
          <p>Searching services…</p>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="sr-empty">
          <div className="sr-empty-icon">◈</div>
          <h3>No services found for "{query}"</h3>
          <p>Try searching with a different keyword</p>
          <button className="sr-browse-btn" onClick={() => navigate("/Home")}>
            Browse All Categories
          </button>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="sr-grid">
          {results.map((service, index) => (
            <div
              key={service.serviceId}
              className="sr-card"
              style={{ "--delay": `${index * 0.06}s` }}
            >
              <div className="sr-card-num">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="sr-card-body">
                <h3 className="sr-service-name">{service.serviceName}</h3>
                {service.serviceType && (
                  <span className="sr-service-type">{service.serviceType}</span>
                )}
              </div>
              <button
                className="sr-view-btn"
                onClick={() => navigate(`/service/${service.serviceId}`)}
              >
                View Providers →
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default SearchResults;
