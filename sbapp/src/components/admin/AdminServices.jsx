import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "./AdminTable.css";

function AdminServices() {
  const [services,    setServices]    = useState([]);
  const [serviceNames,setServiceNames]= useState({});
  const [filter,      setFilter]      = useState("ALL");
  const [search,      setSearch]      = useState("");

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8086/admin/services/all");
      const data = res.data;
      setServices(data);

      // Fetch service names
      const ids = [...new Set(data.map(s => s.serviceId))];
      const nameMap = {};
      await Promise.all(
        ids.map(async id => {
          try {
            const r = await axios.get(`http://localhost:8086/services/byid/${id}`);
            nameMap[id] = r.data;
          } catch { nameMap[id] = `Service #${id}`; }
        })
      );
      setServiceNames(nameMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleApprove = (id) => {
    axios.put(`http://localhost:8086/admin/service/approve/${id}`)
      .then(() => { alert("Service Approved ✅"); fetchServices(); })
      .catch(() => alert("Error approving service"));
  };

  const handleReject = (id) => {
    if (!window.confirm("Reject this service?")) return;
    axios.put(`http://localhost:8086/admin/service/reject/${id}`)
      .then(() => { alert("Service Rejected ❌"); fetchServices(); })
      .catch(() => alert("Error rejecting service"));
  };

  const statusMeta = (s) => {
    if (s === "APPROVED") return { cls: "atb-badge-verified",  label: "Approved" };
    if (s === "REJECTED") return { cls: "atb-badge-rejected",  label: "Rejected" };
    return                       { cls: "atb-badge-pending",   label: "Pending"  };
  };

  const filtered = services
    .filter(s => {
      if (filter === "PENDING")  return s.status === "PENDING";
      if (filter === "APPROVED") return s.status === "APPROVED";
      if (filter === "REJECTED") return s.status === "REJECTED";
      return true;
    })
    .filter(s =>
      s.providerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      serviceNames[s.serviceId]?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase())
    );

  const count = (f) =>
    f === "ALL"      ? services.length :
    f === "PENDING"  ? services.filter(s => s.status === "PENDING").length :
    f === "APPROVED" ? services.filter(s => s.status === "APPROVED").length :
    services.filter(s => s.status === "REJECTED").length;

  return (
    <div className="atb-layout">
      <AdminSidebar />

      <div className="atb-main">
        <div className="atb-header">
          <div>
            <p className="atb-eyebrow">Management</p>
            <h2 className="atb-title">
              Service Approvals
              <span className="atb-count-pill">{services.length}</span>
            </h2>
          </div>
          <input
            className="atb-search"
            placeholder="🔍  Search by provider or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="atb-tabs">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map(f => (
            <button
              key={f}
              className={`atb-tab ${filter === f ? "atb-tab-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="atb-tab-count">{count(f)}</span>
            </button>
          ))}
        </div>

        <div className="atb-table-wrap">
          <table className="atb-table">
            <thead>
              <tr>
                {["#", "Service Name", "Provider", "Location", "Charge", "Working Days", "Status", "Action"].map(h => (
                  <th key={h} className="atb-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const meta = statusMeta(s.status || "PENDING");
                return (
                  <tr key={s.id} className="atb-tr">
                    <td className="atb-td atb-num">{i + 1}</td>
                    <td className="atb-td">
                      <strong style={{ color: "white", fontSize: 14 }}>
                        {serviceNames[s.serviceId] || `#${s.serviceId}`}
                      </strong>
                    </td>
                    <td className="atb-td" style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {s.providerEmail}
                    </td>
                    <td className="atb-td">{s.location || "—"}</td>
                    <td className="atb-td" style={{ color: "#c9a84c", fontWeight: 600 }}>
                      ₹{s.serviceCharge}
                    </td>
                    <td className="atb-td" style={{ fontSize: 11 }}>
                      {s.workingDays
                        ? s.workingDays.split(",").map((d, idx) => (
                            <span key={idx} style={{
                              background: "rgba(201,168,76,0.08)",
                              border: "1px solid rgba(201,168,76,0.15)",
                              borderRadius: 4, padding: "2px 6px",
                              color: "#c9a84c", marginRight: 4,
                              display: "inline-block", marginBottom: 3
                            }}>
                              {d.trim().slice(0, 3)}
                            </span>
                          ))
                        : "—"
                      }
                    </td>
                    <td className="atb-td">
                      <span className={`atb-badge ${meta.cls}`}>{meta.label}</span>
                    </td>
                    <td className="atb-td">
                      <div className="atb-actions">
                        {s.status !== "APPROVED" && (
                          <button className="atb-btn-verify" onClick={() => handleApprove(s.id)}>
                            Approve
                          </button>
                        )}
                        {s.status !== "REJECTED" && (
                          <button className="atb-btn-reject" onClick={() => handleReject(s.id)}>
                            Reject
                          </button>
                        )}
                        {s.status === "APPROVED" && (
                          <button className="atb-btn-reject" onClick={() => handleReject(s.id)}>
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="atb-empty">
              <div className="atb-empty-icon">◈</div>
              <p>No services found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminServices;
