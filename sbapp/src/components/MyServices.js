import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import "./MyServices.css";

function MyServices() {
  const [services,     setServices]     = useState([]);
  const [serviceNames, setServiceNames] = useState({});
  const [loading,      setLoading]      = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const provider = JSON.parse(localStorage.getItem("provider"));
      if (!provider) {
        alert("Please login first");
        navigate("/PrroviderLogin");
        return;
      }
      const email = provider.email;
      try {
        const res          = await axios.get(`http://localhost:8086/provider/services/${email}`);
        const servicesData = res.data;
        setServices(servicesData);

        const namePromises  = servicesData.map(s => axios.get(`http://localhost:8086/services/byid/${s.serviceId}`));
        const nameResponses = await Promise.all(namePromises);
        const nameMap       = {};
        nameResponses.forEach((r, i) => {
          nameMap[servicesData[i].serviceId] = r.data;
        });
        setServiceNames(nameMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axios.delete(`http://localhost:8086/provider/deleteService/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleStatusToggle = async (service) => {
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8086/provider/updateStatus/${service.id}?status=${newStatus}`);
      setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // ✅ Per-service status badge based on admin approval
  const approvalBadge = (status) => {
    if (status === "APPROVED") return { cls: "ms-status-active",   label: "Live"             };
    if (status === "REJECTED") return { cls: "ms-status-inactive", label: "Rejected"         };
    return                            { cls: "ms-status-pending",  label: "Pending Approval" };
  };

  return (
    <div className="ms-layout">
      <Sidebar />

      <div className="ms-main">

        <div className="ms-topbar">
          <div>
            <p className="ms-eyebrow">Provider Portal</p>
            <h2 className="ms-title">My <em>Services</em></h2>
          </div>
          <button className="ms-add-btn" onClick={() => navigate("/AddService")}>
            + Add Service
          </button>
        </div>

        {loading ? (
          <div className="ms-loading">
            <div className="ms-ring" />
            <p>Loading your services…</p>
          </div>
        ) : services.length === 0 ? (
          <div className="ms-empty">
            <div className="ms-empty-icon">◈</div>
            <h3>No Services Yet</h3>
            <p>Start by adding your first service listing.</p>
            <button className="ms-add-btn" onClick={() => navigate("/AddService")}>
              + Add Your First Service
            </button>
          </div>
        ) : (
          <div className="ms-grid">
            {services.map((service, index) => {
              const badge = approvalBadge(service.status);
              return (
                <div
                  key={service.id}
                  className="ms-card"
                  style={{ "--i": index }}
                >
                  <div className="ms-card-top">
                    <div className="ms-card-images">
                      {service.image1 && (
                        <img
                          src={`/assets/services/${service.image1}`}
                          className="ms-card-img"
                          alt="s1"
                        />
                      )}
                      {service.image2 && (
                        <img
                          src={`/assets/services/${service.image2}`}
                          className="ms-card-img"
                          alt="s2"
                        />
                      )}
                      {!service.image1 && !service.image2 && (
                        <div className="ms-card-img-placeholder">◈</div>
                      )}
                    </div>

                    {/* ✅ Per-service admin approval status */}
                    <div className="ms-card-badge">
                      <span className={`ms-status ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  <div className="ms-card-body">
                    <p className="ms-service-id">ID #{service.serviceId}</p>
                    <h3 className="ms-service-name">
                      {serviceNames[service.serviceId] || "Loading…"}
                    </h3>

                    {service.description && (
                      <p className="ms-description">{service.description}</p>
                    )}

                    <div className="ms-info-grid">
                      <div className="ms-info-item">
                        <span className="ms-info-icon">📍</span>
                        <span className="ms-info-val">{service.location || "—"}</span>
                      </div>
                      <div className="ms-info-item">
                        <span className="ms-info-icon">⏰</span>
                        <span className="ms-info-val">
                          {service.workingStart} — {service.workingEnd}
                        </span>
                      </div>
                      <div className="ms-info-item">
                        <span className="ms-info-icon">💰</span>
                        <span className="ms-info-val ms-charge">
                          ₹{service.serviceCharge} <span>/ visit</span>
                        </span>
                      </div>
                    </div>

                    {service.workingDays && (
                      <div className="ms-days-row">
                        {service.workingDays.split(",").map((d, i) => (
                          <span key={i} className="ms-day-pill">
                            {d.trim().slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* ✅ Rejection notice */}
                    {service.status === "REJECTED" && (
                      <div className="ms-rejected-note">
                        ✕ This service was rejected by admin. Delete and re-submit with corrections.
                      </div>
                    )}
                  </div>

                  <div className="ms-card-footer">
                    <button
                      className={`ms-toggle-btn ${service.status === "Active" ? "ms-toggle-active" : "ms-toggle-inactive"}`}
                      onClick={() => handleStatusToggle(service)}
                    >
                      {service.status === "Active" ? "Set Inactive" : service.status === "Inactive" ? "Set Active" : "—"}
                    </button>
                    <button
                      className="ms-delete-btn"
                      onClick={() => handleDelete(service.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyServices;
