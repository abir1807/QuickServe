import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardChart from "../components/DashboardChart";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedProvider = JSON.parse(localStorage.getItem("provider"));
    if (!storedProvider) { navigate("/PrroviderLogin"); return; }
    setProvider(storedProvider);
    fetchDashboardData(storedProvider.email);
  }, [navigate]);

  const fetchDashboardData = async (email) => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        axios.get(`http://localhost:8086/booking/provider/${email}`),
        axios.get(`http://localhost:8086/provider/services/${email}`)
      ]);
      setBookings(bookingsRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
    setLoading(false);
  };

  const totalBookings  = bookings.length;
  const pendingCount   = bookings.filter(b => b.status === "PENDING").length;
  const approvedCount  = bookings.filter(b => b.status === "APPROVED").length;
  const completedCount = bookings.filter(b => b.status === "COMPLETED").length;
  const rejectedCount  = bookings.filter(b => b.status === "REJECTED").length;
  const totalServices  = services.length;

  const recentBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);

  const getChartData = () => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = Array(12).fill(0);
    bookings.forEach(b => {
      if (b.bookingDate) {
        const m = new Date(b.bookingDate).getMonth();
        if (!isNaN(m)) counts[m]++;
      }
    });
    const cur = new Date().getMonth();
    const labels = [], data = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (cur - i + 12) % 12;
      labels.push(months[idx]);
      data.push(counts[idx]);
    }
    return { labels, data };
  };

  const chartInfo = getChartData();

  const statCards = [
    { label: "Total",     value: totalBookings,  color: "#e2c97e", icon: "◈" },
    { label: "Pending",   value: pendingCount,   color: "#fbbf24", icon: "◷" },
    { label: "Approved",  value: approvedCount,  color: "#60a5fa", icon: "◉" },
    { label: "Completed", value: completedCount, color: "#34d399", icon: "◆" },
    { label: "Rejected",  value: rejectedCount,  color: "#f87171", icon: "◇" },
    { label: "Services",  value: totalServices,  color: "#c9a84c", icon: "✦" },
  ];

  const statusMeta = (s) => {
    if (s === "PENDING")   return { cls: "db-badge-pending",   label: "Pending"   };
    if (s === "APPROVED")  return { cls: "db-badge-approved",  label: "Approved"  };
    if (s === "COMPLETED") return { cls: "db-badge-completed", label: "Completed" };
    if (s === "REJECTED")  return { cls: "db-badge-rejected",  label: "Rejected"  };
    return { cls: "", label: s };
  };

  return (
    <div className="db-layout">
      <Sidebar />

      <div className="db-main">

        <div className="db-topbar">
          <div>
            <p className="db-topbar-eyebrow">Overview</p>
            <h2 className="db-topbar-title">
              Welcome, <em>{provider?.providerName}</em>
            </h2>
          </div>
          <div className="db-topbar-right">
            <div className="db-live-badge">
              <span className="db-live-dot" />
              Live
            </div>
            <div className="db-provider-pill">
              {provider?.providerName?.[0]?.toUpperCase() || "P"}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="db-stats-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="db-stat-card db-skeleton">
                <div className="db-skel-line lg" />
                <div className="db-skel-line sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="db-stats-grid">
            {statCards.map((c, i) => (
              <div
                key={i}
                className="db-stat-card"
                style={{ "--i": i, "--accent": c.color }}
              >
                <div className="db-stat-icon" style={{ color: c.color }}>{c.icon}</div>
                <div className="db-stat-value" style={{ color: c.color }}>{c.value}</div>
                <div className="db-stat-label">{c.label}</div>
              </div>
            ))}
          </div>
        )}

        <DashboardChart labels={chartInfo.labels} data={chartInfo.data} />

        <div className="db-table-section">
          <div className="db-table-header">
            <div>
              <p className="db-table-eyebrow">Activity</p>
              <h3 className="db-table-title">Recent <em>Bookings</em></h3>
            </div>
            <button className="db-view-all" onClick={() => navigate("/MyBookings")}>
              View All →
            </button>
          </div>

          {loading ? (
            <div className="db-loading-wrap">
              <div className="db-ring" />
              <p>Loading bookings…</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="db-empty">
              <div className="db-empty-icon">◈</div>
              <h4>No bookings yet</h4>
              <p>Bookings will appear here once users start booking your services.</p>
            </div>
          ) : (
            <div className="db-table-wrap">
              <table className="db-table">
                <thead>
                  <tr>
                    {["#", "User", "Date", "Slot", "Address", "Status", "Action"].map(h => (
                      <th key={h} className="db-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => {
                    const meta = statusMeta(b.status);
                    return (
                      <tr key={b.id} className="db-tr">
                        <td className="db-td db-td-num">{i + 1}</td>
                        <td className="db-td db-td-email">{b.userEmail}</td>
                        <td className="db-td">{b.bookingDate}</td>
                        <td className="db-td">{b.bookingSlot}</td>
                        <td className="db-td db-td-addr">{b.address}</td>
                        <td className="db-td">
                          <span className={`db-badge ${meta.cls}`}>{meta.label}</span>
                        </td>
                        <td className="db-td">
                          {b.status === "PENDING" && (
                            <button
                              className="db-manage-btn"
                              onClick={() => navigate("/MyBookings")}
                            >
                              Manage
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
