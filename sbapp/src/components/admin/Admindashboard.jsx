import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin/login");
      return;
    }
    axios.get("http://localhost:8086/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  const cards = [
    { label: "Total Providers",  value: stats.totalProviders   || 0, color: "#60a5fa", icon: "🧑‍🔧", bg: "rgba(96,165,250,0.08)"   },
    { label: "Pending Approval", value: stats.pendingProviders || 0, color: "#fbbf24", icon: "⏳",   bg: "rgba(251,191,36,0.08)"   },
    { label: "Total Users",      value: stats.totalUsers       || 0, color: "#34d399", icon: "👥",   bg: "rgba(52,211,153,0.08)"   },
    { label: "Total Bookings",   value: stats.totalBookings    || 0, color: "#a78bfa", icon: "📋",   bg: "rgba(167,139,250,0.08)"  },
    { label: "Categories",       value: stats.totalCategories  || 0, color: "#f9a8d4", icon: "📁",   bg: "rgba(249,168,212,0.08)"  },
    { label: "Services",         value: stats.totalServices    || 0, color: "#fb923c", icon: "🛠️",  bg: "rgba(251,146,60,0.08)"   },
  ];

  const quickActions = [
    { label: "Verify Providers",  icon: "🧑‍🔧", path: "/admin/providers",  color: "#60a5fa" },
    { label: "Manage Users",      icon: "👥",   path: "/admin/users",      color: "#34d399" },
    { label: "View Bookings",     icon: "📋",   path: "/admin/bookings",   color: "#a78bfa" },
    { label: "Manage Categories", icon: "📁",   path: "/admin/categories", color: "#fbbf24" },
  ];

  return (
    <div className="ad-layout">
      <AdminSidebar />

      <div className="ad-main">
        {/* Header */}
        <div className="ad-header">
          <div>
            <p className="ad-eyebrow">Overview</p>
            <h2 className="ad-title">Dashboard</h2>
          </div>
          <div className="ad-admin-badge">
            <span className="ad-admin-dot" />
            Admin
          </div>
        </div>

        {/* Stat Cards */}
        <div className="ad-cards-grid">
          {cards.map((c, i) => (
            <div className="ad-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="ad-card-icon" style={{ background: c.bg }}>
                {c.icon}
              </div>
              <div className="ad-card-label">{c.label}</div>
              <div className="ad-card-value" style={{ color: c.color }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="ad-section">
          <h3 className="ad-section-title">Quick Actions</h3>
          <div className="ad-actions-grid">
            {quickActions.map((a, i) => (
              <button
                key={i}
                className="ad-action-btn"
                onClick={() => navigate(a.path)}
                style={{ "--action-color": a.color }}
              >
                <span className="ad-action-icon">{a.icon}</span>
                <span className="ad-action-label">{a.label}</span>
                <span className="ad-action-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
